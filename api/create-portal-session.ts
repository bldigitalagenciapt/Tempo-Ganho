import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
      message: 'STRIPE_SECRET_KEY não configurada no servidor Vercel.',
    });
  }

  const { customerId, returnUrl } = req.body || {};
  if (!customerId) {
    return res.status(400).json({ message: 'O identificador do cliente (customerId) é obrigatório.' });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  try {
    const baseUrl =
      returnUrl ||
      process.env.VITE_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: baseUrl,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error: any) {
    console.error('[Stripe Portal Error]', error);
    return res.status(500).json({
      message: error.message || 'Erro ao criar sessão no portal do cliente Stripe.',
    });
  }
}
