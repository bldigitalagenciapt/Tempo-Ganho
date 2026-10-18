import React from 'react';
import { useApp, ScreenType } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, setIsNewWorkModalOpen } = useApp();

  // If on onboarding or auth screen, hide the bottom bar
  if (currentScreen === 'onboarding' || currentScreen === 'auth') {
    return null;
  }

  const isReportsActive = currentScreen === 'finances' || currentScreen === 'tax';

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsNewWorkModalOpen(true)}
        className="fixed right-6 bottom-24 w-14 h-14 md:w-16 md:h-16 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center cursor-pointer active:scale-90 transition-all z-40 group hover:shadow-2xl hover:brightness-110"
        title="Registar Novo Trabalho"
        aria-label="Registar Novo Trabalho"
      >
        <span className="material-symbols-outlined text-[30px] md:text-[34px] leading-none transition-transform group-hover:rotate-90">
          add
        </span>
        <span className="hidden md:block absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg font-label-caps text-xs tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          NOVO TRABALHO
        </span>
      </button>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/40 shadow-lg">
        {/* Home */}
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 duration-200 ${
            currentScreen === 'home'
              ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 shadow-sm'
              : 'text-on-surface-variant hover:text-primary px-3 py-1'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="font-label-caps text-[11px] font-semibold mt-0.5">Home</span>
        </button>

        {/* Time */}
        <button
          onClick={() => setCurrentScreen('time')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 duration-200 ${
            currentScreen === 'time'
              ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 shadow-sm'
              : 'text-on-surface-variant hover:text-primary px-3 py-1'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'time' ? "'FILL' 1" : "'FILL' 0" }}
          >
            schedule
          </span>
          <span className="font-label-caps text-[11px] font-semibold mt-0.5">Time</span>
        </button>

        {/* Clients */}
        <button
          onClick={() => setCurrentScreen('clients')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 duration-200 ${
            currentScreen === 'clients'
              ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 shadow-sm'
              : 'text-on-surface-variant hover:text-primary px-3 py-1'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'clients' ? "'FILL' 1" : "'FILL' 0" }}
          >
            group
          </span>
          <span className="font-label-caps text-[11px] font-semibold mt-0.5">Clients</span>
        </button>

        {/* Reports / Finances */}
        <button
          onClick={() => setCurrentScreen('finances')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 duration-200 ${
            isReportsActive
              ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 shadow-sm'
              : 'text-on-surface-variant hover:text-primary px-3 py-1'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: isReportsActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            insert_chart
          </span>
          <span className="font-label-caps text-[11px] font-semibold mt-0.5">Reports</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setCurrentScreen('settings')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 duration-200 ${
            currentScreen === 'settings'
              ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 shadow-sm'
              : 'text-on-surface-variant hover:text-primary px-3 py-1'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
          >
            settings
          </span>
          <span className="font-label-caps text-[11px] font-semibold mt-0.5">Settings</span>
        </button>
      </nav>
    </>
  );
};
