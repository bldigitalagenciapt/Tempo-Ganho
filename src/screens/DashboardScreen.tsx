import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    stats,
    formatCurrency,
    currencySymbol,
    clients,
    setSelectedClientForDetails,
    setCurrentScreen,
    setIsNewWorkModalOpen,
  } = useApp();

  const [chartMode, setChartMode] = useState<'euros' | 'horas'>('euros');
  const [activeDay, setActiveDay] = useState<string>('QUA');

  // Chart data for weekdays
  const weeklyData = [
    { day: 'SEG', euros: 420, hours: 5.0, height: '40%' },
    { day: 'TER', euros: 680, hours: 8.0, height: '65%' },
    { day: 'QUA', euros: 850, hours: 9.0, height: '90%' },
    { day: 'QUI', euros: 580, hours: 7.0, height: '55%' },
    { day: 'SEX', euros: 720, hours: 8.5, height: '75%' },
    { day: 'SAB', euros: 150, hours: 2.0, height: '20%' },
    { day: 'DOM', euros: 0, hours: 0.0, height: '8%' },
  ];

  // Format today's date in Portuguese format (e.g. "Hoje é 12 de Junho")
  const todayFormatted = new Intl.DateTimeFormat('pt-PT', {
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <main className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-6 md:mb-8">
        <div className="flex flex-col">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
            Olá {user.name} 👋
          </h1>
          <p className="font-body-sm text-sm text-on-surface-variant capitalize">
            Hoje é {todayFormatted}
          </p>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Hours Card */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-all">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold mb-2 tracking-wider">
            HORAS
          </span>
          <div className="flex flex-col">
            <span className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface font-code">
              {stats.totalHoursThisMonth}h
            </span>
            <span className="font-body-sm text-xs text-secondary font-semibold mt-1">
              +{stats.hoursGrowthVsLastMonth}% vs mês ant.
            </span>
          </div>
        </div>

        {/* Received Card */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-all">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold mb-2 tracking-wider">
            RECEBIDO
          </span>
          <div className="flex flex-col">
            <span className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface font-code">
              {formatCurrency(stats.totalReceived)}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span
                className="material-symbols-outlined text-[15px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                Faturas pagas
              </span>
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:bg-surface-container-low transition-all">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold mb-2 tracking-wider">
            PENDENTE
          </span>
          <div className="flex flex-col">
            <span className="font-headline-lg text-2xl md:text-3xl font-bold text-error font-code">
              {formatCurrency(stats.totalPending)}
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant font-medium mt-1">
              {stats.pendingCount} faturas em aberto
            </span>
          </div>
        </div>

        {/* Goal Card */}
        <div className="bg-primary-container p-4 rounded-xl shadow-sm border border-primary/20 flex flex-col justify-between text-on-primary-container relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs opacity-90 font-semibold tracking-wider">
              META MENSAL
            </span>
            <span className="font-label-caps text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {stats.goalPercentage}%
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-1000 rounded-full"
                style={{ width: `${Math.min(100, stats.goalPercentage)}%` }}
              />
            </div>
            <span className="mt-2 block font-body-sm text-xs text-on-primary-container/90 font-code font-semibold">
              {formatCurrency(Math.round((stats.monthlyGoal * stats.goalPercentage) / 100))} /{' '}
              {formatCurrency(stats.monthlyGoal)}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Alert */}
      <div className="bg-tertiary-fixed p-4 rounded-xl mb-6 md:mb-8 flex items-start gap-3 border border-tertiary-fixed-dim/30 shadow-xs">
        <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">
          lightbulb
        </span>
        <p className="font-body-lg text-sm md:text-base text-on-tertiary-fixed">
          Se continuar neste ritmo, irá faturar aproximadamente{' '}
          <span className="font-bold font-code text-on-tertiary-fixed">
            {formatCurrency(stats.estimatedMonthEnd)}
          </span>{' '}
          este mês.
        </p>
      </div>

      {/* Chart Section */}
      <div className="bg-surface-container-lowest p-5 md:p-6 rounded-xl shadow-sm border border-outline-variant/40 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="font-title-md text-lg md:text-xl font-bold text-on-surface">
              Rendimento Semanal
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Análise de tempo vs ganhos
            </p>
          </div>
          <div className="flex gap-1.5 p-1 bg-surface-container-low rounded-full border border-outline-variant/30">
            <button
              onClick={() => setChartMode('horas')}
              className={`px-3 py-1 rounded-full font-label-caps text-xs font-semibold transition-all cursor-pointer ${
                chartMode === 'horas'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              HORAS
            </button>
            <button
              onClick={() => setChartMode('euros')}
              className={`px-3 py-1 rounded-full font-label-caps text-xs font-semibold transition-all cursor-pointer ${
                chartMode === 'euros'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {currencySymbol === 'R$' ? 'REAIS' : 'EUROS'}
            </button>
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div className="flex items-end justify-between h-52 gap-2 md:gap-6 mt-8 pt-6 px-2">
          {weeklyData.map((item) => {
            const isSelected = activeDay === item.day;
            const heightPercent =
              chartMode === 'euros'
                ? item.height
                : `${Math.max(10, Math.round((item.hours / 10) * 100))}%`;

            return (
              <div
                key={item.day}
                onClick={() => setActiveDay(item.day)}
                className="flex-1 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-full max-w-[52px] rounded-t-lg transition-all duration-500 relative flex items-start justify-center ${
                    isSelected
                      ? 'bg-primary shadow-md'
                      : 'bg-surface-container group-hover:bg-primary/20'
                  }`}
                  style={{ height: heightPercent }}
                >
                  {/* Floating tooltip */}
                  <div
                    className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-inverse-surface text-inverse-on-surface text-[11px] font-code font-bold px-2 py-1 rounded-md shadow-md transition-all ${
                      isSelected
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 group-hover:opacity-100 group-hover:scale-100 pointer-events-none'
                    }`}
                  >
                    {chartMode === 'euros' ? formatCurrency(item.euros) : `${item.hours}h`}
                  </div>
                </div>
                <span
                  className={`mt-3 font-label-caps text-xs font-semibold transition-colors ${
                    isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Clients / Work */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-title-md text-lg font-bold text-on-surface">
            Clientes Recentes
          </h3>
          <button
            onClick={() => setCurrentScreen('clients')}
            className="text-primary font-label-caps text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>VER TODOS</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Scrollable Cards Carousel */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 pt-1">
          {clients.map((client) => {
            const hasPending = client.pendingAmount > 0;
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientForDetails(client)}
                className="min-w-[170px] max-w-[200px] bg-white p-4 rounded-xl border border-outline-variant/40 shadow-sm text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group shrink-0"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 border border-outline-variant/40 overflow-hidden flex items-center justify-center bg-surface-container-high group-hover:scale-105 transition-transform">
                  {client.logoUrl ? (
                    <img
                      className="w-full h-full object-cover"
                      alt={client.name}
                      src={client.logoUrl}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      business
                    </span>
                  )}
                </div>
                <p className="font-body-lg font-semibold text-on-surface text-sm truncate">
                  {client.name}
                </p>
                <p
                  className={`font-body-sm text-xs mt-0.5 font-medium ${
                    hasPending ? 'text-on-surface-variant' : 'text-green-600 font-bold'
                  }`}
                >
                  {hasPending
                    ? `${client.pendingHours || 12}h pendentes`
                    : 'PAGO'}
                </p>
              </div>
            );
          })}

          {/* Quick Add client card */}
          <div
            onClick={() => setCurrentScreen('clients')}
            className="min-w-[140px] bg-surface-container-low/50 p-4 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <span className="font-label-caps text-[11px] text-on-surface-variant font-semibold">
              Adicionar
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
