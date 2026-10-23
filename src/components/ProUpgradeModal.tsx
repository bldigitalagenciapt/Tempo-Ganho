import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isStripeConfigured, redirectToStripeCheckout } from '../lib/stripe';

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, updateUser, user, currentUserId } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isProModalOpen) return null;

  const handleSubscribe = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isStripeConfigured) {
        const result = await redirectToStripeCheckout({
          plan: selectedPlan,
          userId: currentUserId || undefined,
          userEmail: user.email,
        });

        if (!result.success) {
          throw new Error(result.error || 'Erro ao abrir checkout.');
        }
      } else {
        // Modo Demonstração (quando ainda não inseriu chaves reais no .env)
        setTimeout(() => {
          updateUser({
            isPro: true,
            proDaysRemaining: selectedPlan === 'yearly' ? 365 : 30,
          });
          setIsLoading(false);
          setIsProModalOpen(false);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao iniciar pagamento.');
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsProModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-primary/20 animate-fade-in-up max-h-[92vh] flex flex-col my-auto relative">
        {/* Botão Fechar */}
        <button
          onClick={() => setIsProModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Fechar"
          aria-label="Fechar modal"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Banner com Gradiente e Ícone Pro */}
        <div className="h-32 bg-gradient-to-br from-primary via-primary-container to-secondary-container relative flex items-center justify-center overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-25">
            <div className="absolute top-[-40%] left-[-20%] w-64 h-64 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-[-30%] right-[-10%] w-48 h-48 bg-secondary rounded-full blur-xl" />
          </div>
          <div className="relative z-10 w-16 h-16 bg-white/95 rounded-2xl flex items-center justify-center shadow-xl border border-white">
            <span
              className="material-symbols-outlined text-primary text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 text-center overflow-y-auto flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full uppercase tracking-widest mb-2 border border-primary/20">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            PLANO PROFISSIONAL
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2 font-headline-lg">
            Tempo & Ganho Pro
          </h2>
          <p className="text-on-surface-variant text-sm mb-6 max-w-sm mx-auto">
            Automatize faturas, tenha previsibilidade financeira e assessoria fiscal com Inteligência Artificial.
          </p>

          {/* Seletor de Planos Mensal / Anual */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                selectedPlan === 'monthly'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-outline-variant/40 hover:border-outline-variant bg-surface'
              }`}
            >
              <div className="text-xs font-semibold text-on-surface-variant mb-1">Mensal</div>
              <div className="text-lg font-bold text-on-surface">
                {user.currency === 'BRL' ? 'R$ 49' : '€9,90'}
                <span className="text-xs font-normal text-on-surface-variant">/mês</span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">Faturado mensalmente</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('yearly')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                selectedPlan === 'yearly'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-outline-variant/40 hover:border-outline-variant bg-surface'
              }`}
            >
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
                Poupa 25%
              </span>
              <div className="text-xs font-semibold text-on-surface-variant mb-1">Anual</div>
              <div className="text-lg font-bold text-on-surface">
                {user.currency === 'BRL' ? 'R$ 39' : '€7,49'}
                <span className="text-xs font-normal text-on-surface-variant">/mês</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {user.currency === 'BRL' ? 'R$ 468/ano' : '€89,90/ano'}
              </div>
            </button>
          </div>

          {/* Vantagens Exclusivas */}
          <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-2xl mb-6 text-left space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Assistente Financeiro IA com respostas personalizadas</span>
            </div>
            <div className="flex items-center gap-2.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Radar de Faturas em Risco & Previsão de Fecho de Mês</span>
            </div>
            <div className="flex items-center gap-2.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Simulador Fiscal Avançado (IRS & Segurança Social)</span>
            </div>
            <div className="flex items-center gap-2.5 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Sincronização em Nuvem Supabase e Clientes Ilimitados</span>
            </div>
          </div>

          {/* Alerta de erro */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Status do Stripe */}
          {!isStripeConfigured && (
            <div className="p-2.5 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Modo Teste: Chaves do Stripe ainda não preenchidas no .env</span>
            </div>
          )}

          {/* Botão de Ação / Checkout */}
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>A processar...</span>
              </>
            ) : (
              <>
                <span>
                  {isStripeConfigured
                    ? selectedPlan === 'yearly'
                      ? 'Subscrever Anual com Stripe'
                      : 'Subscrever Mensal com Stripe'
                    : 'Ativar Pro no Modo de Demonstração'}
                </span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* Badge de Confiança do Stripe */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant pt-1">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">lock</span>
            <span>Pagamento 100% seguro processado via <strong>Stripe</strong>. Cancele quando quiser.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
