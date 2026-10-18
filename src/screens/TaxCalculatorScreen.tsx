import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const TaxCalculatorScreen: React.FC = () => {
  const { formatCurrency, setIsProModalOpen, setCurrentScreen, user, updateUser } = useApp();

  const [grossRevenue, setGrossRevenue] = useState<number>(user.annualRevenue || 45000);
  const [activityType, setActivityType] = useState<'services' | 'sales' | 'other'>('services');

  // Calculation logic based on Portuguese Simplified Tax Regime (Regime Simplificado)
  const calculateTaxes = () => {
    let coefficient = 0.75;
    if (activityType === 'sales') coefficient = 0.15;
    if (activityType === 'other') coefficient = 0.5;

    // Social security for self-employed: 21.4% over 70% of gross billings
    const ssBase = grossRevenue * (activityType === 'services' ? 0.7 : 0.2);
    const socialSecurity = Math.round(ssBase * 0.214);

    // IRS estimation on taxable income (gross * coefficient)
    const taxableIncome = grossRevenue * coefficient;
    let irsRate = 0.23;
    if (taxableIncome > 50000) irsRate = 0.32;
    else if (taxableIncome > 35000) irsRate = 0.26;
    else if (taxableIncome > 20000) irsRate = 0.21;
    else irsRate = 0.16;

    const estimatedIrs = Math.round(taxableIncome * irsRate);

    const netProfit = Math.max(0, grossRevenue - estimatedIrs - socialSecurity);
    const netProfitMonthly = Math.round(netProfit / 12);
    const netPercentage = Math.round((netProfit / grossRevenue) * 100) || 63;
    const irsPercentage = Math.round((estimatedIrs / grossRevenue) * 100) || 16;
    const ssPercentage = Math.round((socialSecurity / grossRevenue) * 100) || 21;

    return {
      netProfit,
      netProfitMonthly,
      estimatedIrs,
      socialSecurity,
      netPercentage,
      irsPercentage,
      ssPercentage,
    };
  };

  const results = calculateTaxes();

  const handleRecalculate = () => {
    updateUser({ annualRevenue: grossRevenue, taxRegime: activityType });
  };

  return (
    <main className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setCurrentScreen('finances')}
              className="p-1 -ml-1 text-primary hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              title="Voltar para Finanças"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
              Calculadora de Impostos
            </h1>
          </div>
          <p className="text-on-surface-variant font-body-lg text-sm md:text-base">
            Simule o seu lucro real após impostos em Portugal.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('finances')}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 font-title-md text-xs font-semibold text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">bar_chart</span>
          Ver Fluxo de Caixa
        </button>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Panel */}
        <section className="md:col-span-5 lg:col-span-4 bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
              Faturação Bruta Anual
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-code font-bold">
                €
              </span>
              <input
                type="number"
                step="500"
                value={grossRevenue}
                onChange={(e) => setGrossRevenue(Number(e.target.value))}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all font-headline-lg-mobile text-xl font-bold text-on-surface font-code"
                placeholder="45000"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
              Tipo de Atividade
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as any)}
              className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all font-body-lg text-sm text-on-surface appearance-none cursor-pointer"
            >
              <option value="services">Prestação de Serviços (75%)</option>
              <option value="sales">Venda de Mercadorias (15%)</option>
              <option value="other">Outros Rendimentos</option>
            </select>
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              <span className="font-label-caps text-[11px] text-primary uppercase font-bold">
                DICA PRO
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Esta simulação usa as taxas do Regime Simplificado de 2024. Para valores exatos,
              consulte um contabilista certificado.
            </p>
          </div>

          <button
            onClick={handleRecalculate}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-title-md text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            Recalcular Lucro
          </button>
        </section>

        {/* Results Panel */}
        <section className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main Result: Net Profit */}
          <div className="sm:col-span-2 glass-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-l-primary relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                  Lucro Líquido Estimado
                </span>
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface font-code">
                  € {results.netProfit.toLocaleString('pt-PT')}
                </span>
                <span className="text-sm font-medium text-on-surface-variant">/ano</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${results.netPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-label-caps text-primary font-bold">
                  {results.netPercentage}%
                </span>
              </div>
              <p className="mt-4 text-xs md:text-sm text-on-surface-variant">
                Isso equivale a cerca de{' '}
                <span className="font-bold text-on-surface font-code">
                  € {results.netProfitMonthly.toLocaleString('pt-PT')} /mês
                </span>{' '}
                limpos na conta.
              </p>
            </div>
            {/* Decorative background glow */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* IRS Breakdown */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <div>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">
                  IRS (Estimado)
                </span>
                <h3 className="font-title-md text-lg font-bold text-on-surface font-code">
                  € {results.estimatedIrs.toLocaleString('pt-PT')}
                </h3>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Retenção na fonte média ou liquidação anual baseada no regime simplificado.
            </p>
          </div>

          {/* Social Security */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[20px]">security</span>
              </div>
              <div>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">
                  Seg. Social
                </span>
                <h3 className="font-title-md text-lg font-bold text-on-surface font-code">
                  € {results.socialSecurity.toLocaleString('pt-PT')}
                </h3>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cálculo trimestral de 21.4% sobre 70% da faturação de serviços.
            </p>
          </div>

          {/* Visual Chart Representation */}
          <div className="sm:col-span-2 bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <h4 className="font-title-md text-sm md:text-base font-bold text-on-surface">
                Distribuição do Valor
              </h4>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-on-surface-variant font-medium">Lucro ({results.netPercentage}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-on-surface-variant font-medium">IRS ({results.irsPercentage}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-on-surface-variant font-medium">SS ({results.ssPercentage}%)</span>
                </div>
              </div>
            </div>

            <div className="flex h-10 w-full rounded-xl overflow-hidden shadow-inner bg-slate-100">
              <div
                className="h-full bg-primary transition-all duration-700 flex items-center justify-center text-white text-[11px] font-bold"
                style={{ width: `${results.netPercentage}%` }}
                title={`Lucro: ${results.netPercentage}%`}
              >
                {results.netPercentage > 20 ? `${results.netPercentage}%` : ''}
              </div>
              <div
                className="h-full bg-orange-400 transition-all duration-700 flex items-center justify-center text-white text-[11px] font-bold"
                style={{ width: `${results.irsPercentage}%` }}
                title={`IRS: ${results.irsPercentage}%`}
              >
                {results.irsPercentage > 12 ? `${results.irsPercentage}%` : ''}
              </div>
              <div
                className="h-full bg-blue-400 transition-all duration-700 flex items-center justify-center text-white text-[11px] font-bold"
                style={{ width: `${results.ssPercentage}%` }}
                title={`SS: ${results.ssPercentage}%`}
              >
                {results.ssPercentage > 12 ? `${results.ssPercentage}%` : ''}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action Banner */}
      <section className="mt-8 bg-primary-container rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-xl md:text-2xl font-bold text-on-primary-container mb-2">
            Automatize os seus recibos
          </h2>
          <p className="text-on-primary-container/85 text-xs md:text-sm max-w-lg leading-relaxed">
            Conecte o seu faturamento para ver estes gráficos em tempo real e nunca mais tenha
            surpresas com as Finanças.
          </p>
        </div>
        <button
          onClick={() => setIsProModalOpen(true)}
          className="relative z-10 px-8 py-3 bg-white text-primary rounded-full font-title-md text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          Ativar Pro
        </button>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[130px]">monitoring</span>
        </div>
      </section>
    </main>
  );
};
