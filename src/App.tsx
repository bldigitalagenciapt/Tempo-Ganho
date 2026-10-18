/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

const MainAppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const isFullscreenScreen = currentScreen === 'onboarding' || currentScreen === 'auth';

  return (
    <div className="min-h-screen bg-background text-on-background font-body-lg overflow-x-hidden selection:bg-primary-container/20 selection:text-primary">
      {/* Top App Bar Header (Hidden in Onboarding & Auth screens) */}
      {!isFullscreenScreen && <Header />}

      {/* Screen Router */}
      <div className="w-full">
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

      {/* Global Modals & Sheets */}
      <CalendarModal />
      <NewWorkModal />
      <NewClientModal />
      <ClientDetailsModal />
      <NewExpenseModal />
      <ProUpgradeModal />

      {/* Persistent Bottom Nav & Floating Action Button */}
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
