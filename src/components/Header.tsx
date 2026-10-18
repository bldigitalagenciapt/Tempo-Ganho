import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { user, currentScreen, setCurrentScreen, setIsCalendarModalOpen } = useApp();

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
