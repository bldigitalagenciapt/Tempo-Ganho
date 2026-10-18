import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const stepsData = [
    {
      title: 'Controle as suas horas de trabalho',
      description:
        'Organize seu dia a dia com um cronômetro intuitivo e gestão simplificada de tarefas.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAb0NUOpAisiHHMiTt8KbtDcDpiW53ScqUJtQhsNKAvAcjeaSY2Gict_EJk4qRHVK2ZN2gWaCPcuC4vd8fcvHlWgCH_WO0_YFnHLrDBp_9gsZdCdT7E9KFW0FTdlSorbsHbyvw8LHs3pUYgx3u-TLT0jkCsJ3t_iyg5hsoLyJTlscqIqtvOutfhUoCy88UXinRWXYoyEBK7NkeUPV5dagU0Jc9WQY9E5X5hSED3THw6XSbeke4n0M2_n1MbyNs_VtpNf955PM0HezA',
      alt: 'Clock illustration',
    },
    {
      title: 'Saiba exatamente quanto tem para receber',
      description:
        'Visualize seus ganhos futuros em tempo real enquanto trabalha nos seus projetos favoritos.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDSm95Te-H5GoeyyvOt4VNBmB--gPUdqADDvlgJ472lzmL_6v55mfZR0t3fhRK9ilxLcSIzdwxAPSqm4fVO-Ni4bODYD3lw1p-on-G5-MuwyJIoZj05z-whNDokMmasC6jKJToIxrJgriR-5y1yzsAKHLiM2PTv5OzKJxqEskl3vba5GZKURIUIJByRnQ3HRs_7e8S8zugZ9qDI8ckgADpID9kSlKVXFpHcwbP5M4bIjRIGvL6dwoNTwFgcfzwUS37EhvqWNSpf4s0',
      alt: 'Growth chart illustration',
    },
    {
      title: 'Transforme horas em dinheiro',
      description:
        'Gere relatórios profissionais e fature seus clientes com apenas alguns cliques.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_euygzlB1XOGh7rl-3oKbIbSXJ2c2Z4FnJgW1AaCV66qv_vL1G8s035XTtm9rPXRrZLoEwlzuvQzM9u7mSKcoXFdZ-pa564c5-bDM5Y_HwKuYH6IqPhBqSLjUry9bs8cySBC5pUEe2AphVKA0nY_7u54_w5qcls7OAPp68RLg9NL6v8n34rjWzAf167xCaJkxp0hKKGee9D5oVAkWYvnfvvGHgaUVKk02rzes3mhrIySffzcO9-q04CKuYl4YUs1Sv-XQkSuZCXI',
      alt: 'Wallet and success illustration',
    },
  ];

  const currentData = stepsData[step - 1];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setCurrentScreen('home');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden relative">
      {/* Top Header */}
      <header className="w-full max-w-lg flex justify-between items-center h-16 px-4">
        <span className="text-xl md:text-2xl font-headline-lg font-bold text-primary">
          Tempo & Ganho
        </span>
        <button
          onClick={() => setCurrentScreen('home')}
          className="text-on-surface-variant font-label-caps hover:text-primary transition-all uppercase tracking-wider text-xs font-semibold cursor-pointer"
        >
          Pular
        </button>
      </header>

      {/* Main Slide Content */}
      <main className="w-full max-w-md flex flex-col items-center text-center my-auto py-6">
        <div className="w-full aspect-square max-w-[300px] md:max-w-[340px] mb-8 relative flex items-center justify-center">
          <img
            src={currentData.image}
            alt={currentData.alt}
            className="w-full h-full object-contain rounded-2xl shadow-sm transition-all duration-500 scale-100"
          />
        </div>

        <h1 className="font-headline-lg-mobile text-2xl md:text-3xl font-bold text-on-surface mb-3 px-4">
          {currentData.title}
        </h1>
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant max-w-xs mx-auto leading-relaxed">
          {currentData.description}
        </p>
      </main>

      {/* Footer Controls */}
      <footer className="w-full max-w-md pb-8 px-4 flex flex-col items-center gap-6">
        {/* Progress Indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === idx + 1 ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/60'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full h-14 bg-primary-container text-on-primary-container font-body-lg text-base font-semibold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>{step === totalSteps ? 'Começar' : 'Próximo'}</span>
          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </footer>
    </div>
  );
};
