import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';

export const SettingsScreen: React.FC = () => {
  const { user, updateUser, setCurrentScreen, setIsProModalOpen, formatCurrency } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [goal, setGoal] = useState(user.monthlyGoal.toString());
  const [currency, setCurrency] = useState<Currency>(user.currency);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || 'João',
      email: email.trim() || 'joao@exemplo.com',
      monthlyGoal: parseFloat(goal) || 3650,
      currency,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const resetAllData = () => {
    if (confirm('Tem a certeza de que deseja restaurar os dados de exemplo padrão?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <main className="pt-20 pb-32 px-4 md:px-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-xl md:text-2xl font-bold font-headline-lg text-on-surface">
          Definições & Perfil
        </h1>
      </div>

      {/* User Card */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container shadow-xs">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-title-md text-base font-bold text-on-surface">{user.name}</h2>
              {user.isPro && (
                <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant font-medium">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsProModalOpen(true)}
          className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20"
        >
          {user.isPro ? `${user.proDaysRemaining}d Restantes` : 'Ativar Pro'}
        </button>
      </div>

      {/* Form Settings */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm mb-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
              SEU NOME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
              EMAIL PROFISSIONAL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                MOEDA PRINCIPAL
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium cursor-pointer"
              >
                <option value="EUR">Euro (€) - Portugal / Europa</option>
                <option value="BRL">Real (R$) - Brasil</option>
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                META MENSAL
              </label>
              <input
                type="number"
                step="50"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-code text-sm font-semibold"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {savedSuccess ? 'check_circle' : 'save'}
              </span>
              <span>{savedSuccess ? 'Definições Guardadas!' : 'Guardar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* App Shortcuts & Actions */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm space-y-2 text-sm font-medium">
        <button
          onClick={() => setCurrentScreen('onboarding')}
          className="w-full p-3 hover:bg-surface-container-low rounded-xl flex items-center justify-between text-on-surface transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">slideshow</span>
            <span>Ver Apresentação Inicial (Onboarding)</span>
          </div>
          <span className="material-symbols-outlined text-outline-variant text-[18px]">
            chevron_right
          </span>
        </button>

        <button
          onClick={() => setCurrentScreen('tax')}
          className="w-full p-3 hover:bg-surface-container-low rounded-xl flex items-center justify-between text-on-surface transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[20px]">calculate</span>
            <span>Simulador de Impostos Portugal</span>
          </div>
          <span className="material-symbols-outlined text-outline-variant text-[18px]">
            chevron_right
          </span>
        </button>

        <button
          onClick={() => setCurrentScreen('auth')}
          className="w-full p-3 hover:bg-surface-container-low rounded-xl flex items-center justify-between text-on-surface transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              lock_reset
            </span>
            <span>Ecrã de Login & Criação de Conta</span>
          </div>
          <span className="material-symbols-outlined text-outline-variant text-[18px]">
            chevron_right
          </span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full p-3 hover:bg-red-50 rounded-xl flex items-center justify-between text-error transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-[20px]">restart_alt</span>
            <span>Restaurar Dados Padrão da Demonstração</span>
          </div>
          <span className="material-symbols-outlined text-error/60 text-[18px]">
            chevron_right
          </span>
        </button>
      </div>
    </main>
  );
};
