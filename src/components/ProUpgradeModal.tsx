import React from 'react';
import { useApp } from '../context/AppContext';

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, updateUser, user } = useApp();

  if (!isProModalOpen) return null;

  const handleActivatePro = () => {
    updateUser({ isPro: true, proDaysRemaining: 30 });
    setIsProModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-primary-container/30 animate-fade-in-up">
        {/* Banner with gradient */}
        <div className="h-32 bg-primary-container relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-surface rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-secondary rounded-full" />
          </div>
          <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span
              className="material-symbols-outlined text-primary text-[34px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
        </div>

        <div className="p-6 text-center">
          <span className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-widest block mb-1">
            PLANO EXCLUSIVO
          </span>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mb-2">
            Tempo & Ganho Pro
          </h2>
          <p className="text-on-surface-variant text-sm mb-5">
            Automatize os seus recibos, tenha análise inteligente de fluxo de caixa e simulação fiscal
            precisa.
          </p>

          <div className="bg-surface-container-low border border-primary-container/20 p-4 rounded-xl mb-6 text-left space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Assistente Financeiro IA com respostas personalizadas</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Projeção de fecho de mês e radar de faturas em risco</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Simulador de IRS & Segurança Social (Regime Simplificado)</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <span>Clientes ilimitados com relatórios em PDF para download</span>
            </div>
          </div>

          <button
            onClick={handleActivatePro}
            className="w-full h-12 bg-primary text-on-primary font-title-md rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
          >
            <span>{user.isPro ? 'Renovar Plano Pro' : 'Ativar Plano Pro (15 Dias Grátis)'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={() => setIsProModalOpen(false)}
            className="text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer py-1"
          >
            Voltar para o aplicativo
          </button>
        </div>
      </div>
    </div>
  );
};
