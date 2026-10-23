import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Lê buffer bruto para validação da assinatura criptográfica do Stripe
async function buffer(readable: any): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return res.status(500).json({ message: 'STRIPE_SECRET_KEY não configurada.' });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);
    } else {
      // Modo de teste sem webhook secret configurado
      event = JSON.parse(buf.toString()) as Stripe.Event;
      console.warn('[Stripe Webhook] Alerta: Webhook executado sem verificação de assinatura (STRIPE_WEBHOOK_SECRET ausente).');
    }
  } catch (err: any) {
    console.error('[Stripe Webhook] Erro na assinatura do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Inicializa cliente do Supabase com Service Role Key (para contornar RLS em webhooks de backend)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  const supabase =
    supabaseUrl && supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey)
      : null;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const plan = session.metadata?.plan || 'monthly';
        const daysToAdd = plan === 'yearly' ? 365 : 30;

        console.log(`[Stripe Webhook] Checkout concluído para usuário: ${userId}, Plano: ${plan}`);

        if (supabase && userId) {
          // Atualiza perfil do usuário para Pro
          await supabase
            .from('profiles')
            .update({
              is_pro: true,
              pro_days_remaining: daysToAdd,
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          // Registra ou atualiza a assinatura
          if (subscriptionId) {
            await supabase.from('subscriptions').upsert(
              {
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                status: 'active',
                price_id: session.line_items?.data[0]?.price?.id || null,
                current_period_end: new Date(Date.now() + daysToAdd * 86400000).toISOString(),
              },
              { onConflict: 'stripe_subscription_id' }
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`[Stripe Webhook] Assinatura cancelada para customer: ${customerId}`);

        if (supabase && customerId) {
          // Remove status Pro ao encerrar
          await supabase
            .from('profiles')
            .update({
              is_pro: false,
              pro_days_remaining: 0,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        if (supabase && customerId && (invoice.subscription || invoice.parent?.subscription_details?.subscription)) {
          await supabase
            .from('profiles')
            .update({
              is_pro: true,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Falha ao processar evento:', error);
    return res.status(500).json({ error: error.message || 'Erro no processamento do webhook' });
  }
}
