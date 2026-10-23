/**
 * Configuração e Funções Auxiliares do Stripe para o Tempo & Ganho
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  priceMonthlyId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY_ID || '',
  priceYearlyId: import.meta.env.VITE_STRIPE_PRICE_YEARLY_ID || '',
  paymentLinkMonthly: import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY || '',
  paymentLinkYearly: import.meta.env.VITE_STRIPE_PAYMENT_LINK_YEARLY || '',
};

export const isStripeConfigured = Boolean(
  (STRIPE_CONFIG.publishableKey &&
    STRIPE_CONFIG.publishableKey.startsWith('pk_') &&
    !STRIPE_CONFIG.publishableKey.includes('pk_test_...')) ||
    (STRIPE_CONFIG.paymentLinkMonthly && STRIPE_CONFIG.paymentLinkMonthly.startsWith('https://buy.stripe.com/'))
);

export interface CheckoutOptions {
  plan: 'monthly' | 'yearly';
  userId?: string;
  userEmail?: string;
}

/**
 * Redireciona o usuário para o Checkout do Stripe
 * Suporta tanto as Vercel Serverless Functions (/api/create-checkout-session)
 * quanto Links de Pagamento Diretos do Stripe (Payment Links).
 */
export async function redirectToStripeCheckout({
  plan,
  userId,
  userEmail,
}: CheckoutOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Prioridade: Se houver Payment Link direto configurado
    const directPaymentLink =
      plan === 'monthly' ? STRIPE_CONFIG.paymentLinkMonthly : STRIPE_CONFIG.paymentLinkYearly;

    if (directPaymentLink && directPaymentLink.startsWith('https://buy.stripe.com/')) {
      const url = new URL(directPaymentLink);
      if (userEmail) url.searchParams.set('prefilled_email', userEmail);
      if (userId) url.searchParams.set('client_reference_id', userId);
      window.location.href = url.toString();
      return { success: true };
    }

    // 2. Chamar a API Serverless na Vercel (/api/create-checkout-session)
    const priceId =
      plan === 'monthly' ? STRIPE_CONFIG.priceMonthlyId : STRIPE_CONFIG.priceYearlyId;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: priceId || (plan === 'monthly' ? 'price_monthly_sample' : 'price_yearly_sample'),
        userId,
        userEmail,
        plan,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Erro no servidor: ${response.statusText}`);
    }

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
      return { success: true };
    } else {
      throw new Error('Nenhum link de checkout retornado pelo Stripe.');
    }
  } catch (error: any) {
    console.error('[Stripe] Erro ao iniciar checkout:', error);
    return {
      success: false,
      error: error.message || 'Falha ao conectar com o serviço de pagamento Stripe.',
    };
  }
}

/**
 * Redireciona o usuário para o Portal do Cliente Stripe (gerir assinatura / faturas)
 */
export async function redirectToCustomerPortal(customerId: string): Promise<void> {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) throw new Error('Não foi possível abrir o portal do cliente.');
    const { url } = await response.json();
    if (url) window.location.href = url;
  } catch (err) {
    console.error('[Stripe Portal] Erro:', err);
    alert('Erro ao abrir portal da assinatura. Por favor, tente novamente mais tarde.');
  }
}
