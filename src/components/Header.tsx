import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    user,
    currentScreen,
    setCurrentScreen,
    setIsCalendarModalOpen,
    setIsPeriodClosingModalOpen,
  } = useApp();

  return (
    <header className="fixed top-0 left-0 w-full bg-surface/90 backdrop-blur-md shadow-sm z-40 transition-colors border-b border-outline-variant/30">
      <div className="flex justify-between items-center h-16 px-4 md:px-8 w-full max-w-7xl mx-auto">
        {/* Brand & User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('settings')}
            className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed border border-outline-variant cursor-pointer active:scale-95 transition-transform shrink-0 relative group"
            title="Ver Perfil & Definições"
          >
            <img
              alt={`${user.name} avatar`}
              className="w-full h-full object-cover"
              src={user.avatarUrl}
            />
            <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </button>

          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 cursor-pointer text-left group"
          >
            <span className="font-headline-lg-mobile text-xl md:text-2xl font-bold text-primary tracking-tight group-hover:opacity-90 transition-opacity">
              Tempo & Ganho
            </span>
            {user.isPro && (
              <span className="hidden sm:inline-block px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                PRO
              </span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Página de Vendas */}
          <button
            onClick={() => setCurrentScreen('landing')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
            title="Ver Página de Vendas"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Página de Vendas</span>
          </button>

          {/* Fecho de Período / Exportação */}
          <button
            onClick={() => setIsPeriodClosingModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-700/60 transition-all cursor-pointer active:scale-95"
            title="Fecho de Período & Exportação WhatsApp/PDF"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span className="hidden sm:inline">Fecho / Exportar</span>
          </button>

          {/* Quick AI Smart Assistant Button */}
          <button
            onClick={() => setCurrentScreen('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              currentScreen === 'ai'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-primary-container/10 text-primary hover:bg-primary-container/20 border border-primary/20'
            }`}
            title="Assistente Financeiro IA"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span className="hidden sm:inline">Assistente IA</span>
          </button>

          {/* Calendar Picker Trigger */}
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="p-2 text-primary hover:bg-surface-container-low transition-colors rounded-full cursor-pointer active:scale-95"
            title="Selecionar Data"
          >
            <span className="material-symbols-outlined text-[22px]">calendar_today</span>
          </button>
        </div>
      </div>
    </header>
  );
};
