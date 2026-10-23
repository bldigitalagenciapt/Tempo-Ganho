import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para permitir chamadas do frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido. Utilize POST.' });
  }

  if (!stripeSecretKey) {
    return res.status(500).json({
      message:
        'Chave secreta do Stripe (STRIPE_SECRET_KEY) não encontrada nas variáveis de ambiente da Vercel.',
    });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  try {
    const { priceId, userId, userEmail, returnUrl, plan } = req.body || {};

    const baseUrl =
      returnUrl ||
      process.env.VITE_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Se não for fornecido priceId válido, define fallback conforme plano
    const targetPriceId =
      priceId && !priceId.includes('sample')
        ? priceId
        : plan === 'yearly'
        ? process.env.VITE_STRIPE_PRICE_YEARLY_ID
        : process.env.VITE_STRIPE_PRICE_MONTHLY_ID;

    if (!targetPriceId) {
      return res.status(400).json({
        message:
          'Identificador de Preço (Price ID) do Stripe não configurado. Verifique VITE_STRIPE_PRICE_MONTHLY_ID ou VITE_STRIPE_PRICE_YEARLY_ID.',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail || undefined,
      client_reference_id: userId || undefined,
      metadata: {
        userId: userId || '',
        userEmail: userEmail || '',
        plan: plan || 'monthly',
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          userEmail: userEmail || '',
        },
      },
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error);
    return res.status(500).json({
      message: error.message || 'Erro ao processar sessão de checkout no Stripe.',
    });
  }
}
