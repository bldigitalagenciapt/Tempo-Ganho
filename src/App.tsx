/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CalendarModal } from './components/CalendarModal';
import { NewWorkModal } from './components/NewWorkModal';
import { NewClientModal } from './components/NewClientModal';
import { ClientDetailsModal } from './components/ClientDetailsModal';
import { NewExpenseModal } from './components/NewExpenseModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';

import { DashboardScreen } from './screens/DashboardScreen';
import { WorkScreen } from './screens/WorkScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { FinancesScreen } from './screens/FinancesScreen';
import { TaxCalculatorScreen } from './screens/TaxCalculatorScreen';
import { AiAssistantScreen } from './screens/AiAssistantScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LandingScreen } from './screens/LandingScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen, updateUser } = useApp();
  const [stripeNotification, setStripeNotification] = useState<{
    type: 'success' | 'cancelled';
    message: string;
  } | null>(null);

  const isFullscreenScreen =
    currentScreen === 'landing' || currentScreen === 'onboarding' || currentScreen === 'auth';

  useEffect(() => {
    if (currentScreen !== 'landing') {
      localStorage.setItem('tempo_ganho_entered_app', 'true');
    }
  }, [currentScreen]);

  // Detecta retorno de sucesso ou cancelamento do Stripe Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('checkout');

    if (checkoutStatus === 'success') {
      updateUser({ isPro: true, proDaysRemaining: 30 });
      setStripeNotification({
        type: 'success',
        message: '🎉 Parabéns! A sua assinatura do Tempo & Ganho Pro foi ativada com sucesso via Stripe.',
      });

      // Remove os parâmetros da URL sem recarregar a página
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (checkoutStatus === 'cancelled') {
      setStripeNotification({
        type: 'cancelled',
        message: 'O processo de checkout no Stripe foi cancelado. Nenhuma cobrança foi efetuada.',
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background font-body-lg overflow-x-hidden selection:bg-primary-container/20 selection:text-primary">
      {/* Notificação Flutuante de Retorno do Stripe */}
      {stripeNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-fade-in-down"
        >
          <div
            className={`p-4 rounded-2xl shadow-xl flex items-center justify-between border ${
              stripeNotification.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-500/40'
                : 'bg-surface-container-highest text-on-surface border-outline-variant/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[24px] ${
                  stripeNotification.type === 'success' ? 'text-emerald-400' : 'text-amber-500'
                }`}
              >
                {stripeNotification.type === 'success' ? 'verified' : 'info'}
              </span>
              <p className="text-xs md:text-sm font-medium">{stripeNotification.message}</p>
            </div>
            <button
              onClick={() => setStripeNotification(null)}
              className="ml-3 p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </aside>
      )}

      {/* Top App Bar Header (Oculto no Onboarding e Auth) */}
      {!isFullscreenScreen && <Header />}

      {/* Screen Router */}
      <div className="w-full">
        {currentScreen === 'landing' && <LandingScreen />}
        {currentScreen === 'home' && <DashboardScreen />}
        {currentScreen === 'time' && <WorkScreen />}
        {currentScreen === 'clients' && <ClientsScreen />}
        {currentScreen === 'finances' && <FinancesScreen />}
        {currentScreen === 'tax' && <TaxCalculatorScreen />}
        {currentScreen === 'ai' && <AiAssistantScreen />}
        {currentScreen === 'onboarding' && <OnboardingScreen />}
        {currentScreen === 'auth' && <AuthScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>

      {/* Modais Globais */}
      <CalendarModal />
      <NewWorkModal />
      <NewClientModal />
      <ClientDetailsModal />
      <NewExpenseModal />
      <ProUpgradeModal />

      {/* Bottom Nav Persistente */}
      {!isFullscreenScreen && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
