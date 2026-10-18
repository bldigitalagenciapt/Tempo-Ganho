import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const FinancesScreen: React.FC = () => {
  const {
    formatCurrency,
    stats,
    expenses,
    setIsNewExpenseModalOpen,
    setIsProModalOpen,
    setCurrentScreen,
    deleteExpense,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'finances' | 'tax'>('finances');

  return (
    <main className="pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Segmented Subnav to switch between Finanças & Calculadora de Impostos */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40">
          <button
            onClick={() => setActiveTab('finances')}
            className={`px-4 py-2 rounded-lg font-title-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'finances'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Fluxo & Finanças
          </button>
          <button
            onClick={() => setCurrentScreen('tax')}
            className="px-4 py-2 rounded-lg font-title-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Calculadora de Impostos
          </button>
        </div>

        <button
          onClick={() => setIsProModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          PRO ATIVO
        </button>
      </div>

      {/* Summary Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Receitas do Mês */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">
            RECEITAS DO MÊS
          </span>
          <div className="flex items-end justify-between">
            <span className="font-code text-2xl md:text-3xl font-bold text-on-surface">
              {formatCurrency(2850)}
            </span>
            <span className="text-green-600 flex items-center font-label-caps text-xs font-bold gap-0.5">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12%
            </span>
          </div>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">
            PAGAMENTOS PENDENTES
          </span>
          <div className="flex items-end justify-between">
            <span className="font-code text-2xl md:text-3xl font-bold text-error">
              {formatCurrency(850)}
            </span>
            <span
              className="text-amber-500 material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <span className="font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">
            DESPESAS
          </span>
          <div className="flex items-end justify-between">
            <span className="font-code text-2xl md:text-3xl font-bold text-on-surface">
              {formatCurrency(stats.totalExpenses)}
            </span>
            <span className="text-error material-symbols-outlined text-[24px]">trending_down</span>
          </div>
        </div>
      </section>

      {/* Highlight Card: Lucro Líquido Disponível */}
      <section className="bg-primary-container text-on-primary-container p-6 rounded-xl shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-primary opacity-30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-label-caps text-xs uppercase opacity-85 tracking-widest font-bold">
              LUCRO LÍQUIDO DISPONÍVEL
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-headline-lg text-3xl md:text-4xl font-bold text-white font-code">
                {formatCurrency(stats.netProfit)}
              </span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-white">
                TOTAL ATUAL
              </span>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('tax')}
            className="self-start sm:self-auto px-4 py-2 bg-white text-primary text-xs font-bold rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Ver Simulação de Impostos
          </button>
        </div>
      </section>

      {/* Cash Flow Section (PRO) */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-title-md text-lg md:text-xl font-bold">Fluxo de Caixa</h2>
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-[11px] font-label-caps font-semibold">REC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
              <span className="text-[11px] font-label-caps font-semibold">PEN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-error" />
              <span className="text-[11px] font-label-caps font-semibold">DES</span>
            </div>
          </div>
        </div>

        {/* Fintech Chart Mockup */}
        <div className="h-44 flex items-end justify-between gap-3 md:gap-8 pt-4 px-2">
          {/* JAN */}
          <div className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full max-w-[48px] flex flex-col items-center gap-0.5">
              <div className="w-full bg-primary rounded-t-sm h-12" />
              <div className="w-full bg-outline-variant h-4" />
              <div className="w-full bg-error rounded-b-sm h-2" />
            </div>
            <span className="text-[11px] font-label-caps mt-2 text-on-surface-variant font-semibold">
              JAN
            </span>
          </div>
          {/* FEV */}
          <div className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full max-w-[48px] flex flex-col items-center gap-0.5">
              <div className="w-full bg-primary rounded-t-sm h-16" />
              <div className="w-full bg-outline-variant h-6" />
              <div className="w-full bg-error rounded-b-sm h-3" />
            </div>
            <span className="text-[11px] font-label-caps mt-2 text-on-surface-variant font-semibold">
              FEV
            </span>
          </div>
          {/* MAR */}
          <div className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full max-w-[48px] flex flex-col items-center gap-0.5">
              <div className="w-full bg-primary rounded-t-sm h-24" />
              <div className="w-full bg-outline-variant h-8" />
              <div className="w-full bg-error rounded-b-sm h-4" />
            </div>
            <span className="text-[11px] font-label-caps mt-2 text-on-surface-variant font-semibold">
              MAR
            </span>
          </div>
          {/* ABR (Active) */}
          <div className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full max-w-[48px] flex flex-col items-center gap-0.5 scale-105">
              <div className="w-full bg-primary rounded-t-sm h-28 shadow-md" />
              <div className="w-full bg-outline-variant h-10" />
              <div className="w-full bg-error rounded-b-sm h-5" />
            </div>
            <span className="text-[11px] font-label-caps mt-2 text-primary font-bold">
              ABR
            </span>
          </div>
          {/* MAI (Projected) */}
          <div className="flex-1 flex flex-col gap-1 items-center opacity-40">
            <div className="w-full max-w-[48px] flex flex-col items-center gap-0.5">
              <div className="w-full bg-primary/50 rounded-t-sm h-20" />
              <div className="w-full bg-outline-variant/50 h-12" />
              <div className="w-full bg-error/50 rounded-b-sm h-6" />
            </div>
            <span className="text-[11px] font-label-caps mt-2 text-on-surface-variant font-semibold">
              MAI
            </span>
          </div>
        </div>
      </section>

      {/* Month-End Forecast (PRO) */}
      <section className="bg-surface-container-high border-2 border-primary/20 p-5 rounded-xl flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <span className="material-symbols-outlined text-primary text-[26px]">auto_graph</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs text-primary font-bold tracking-wider">
              PREVISÃO FECHAMENTO
            </span>
            <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
              PRO
            </span>
          </div>
          <p className="font-body-sm text-xs md:text-sm text-on-surface mt-1 leading-relaxed">
            Se continuar neste ritmo, terminará o mês com aproximadamente{' '}
            <span className="font-bold font-code text-primary">
              {formatCurrency(3420)}
            </span>{' '}
            de faturação.
          </p>
        </div>
      </section>

      {/* Expense Management */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-title-md text-lg md:text-xl font-bold">Gestão de Despesas</h2>
          <button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary text-primary font-label-caps text-xs font-bold hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> NOVA DESPESA
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <span className="material-symbols-outlined text-[20px]">
                      {expense.category === 'fuel'
                        ? 'local_gas_station'
                        : expense.category === 'tools'
                        ? 'build'
                        : expense.category === 'food'
                        ? 'restaurant'
                        : 'receipt'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body-lg text-sm font-semibold text-on-surface">
                      {expense.title}
                    </p>
                    <p className="font-body-sm text-xs text-on-surface-variant">{expense.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-code text-sm font-bold text-error">
                    - {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1 text-slate-300 hover:text-error rounded-md transition-colors cursor-pointer"
                    title="Excluir despesa"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Analysis (PRO) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-title-md text-lg md:text-xl font-bold">Análise Inteligente</h2>
          <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            PRO
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200/60 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 text-[24px]">savings</span>
            <p className="font-body-sm text-xs font-semibold text-green-800">
              Gasto 15% menos em combustível este mês
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200/60 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">trending_up</span>
            <p className="font-body-sm text-xs font-semibold text-blue-800">
              Lucro aumentou 22% vs Março
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[24px]">schedule</span>
            <p className="font-body-sm text-xs font-semibold text-amber-800">
              €850 pendentes há +15 dias (ver fatura TechFlow)
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200/60 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">stars</span>
            <p className="font-body-sm text-xs font-semibold text-primary">
              Cliente TechFlow representa 40% da faturação
            </p>
          </div>
        </div>
      </section>

      {/* Health Gauge & Tax Reserve (PRO) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Health Gauge */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="font-label-caps text-xs text-on-surface-variant font-bold tracking-wider">
              SAÚDE FINANCEIRA
            </h3>
            <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              EXCELENTE
            </span>
          </div>
          <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden flex my-2">
            <div className="h-full w-1/3 bg-error/30" />
            <div className="h-full w-1/3 bg-amber-400/30" />
            <div className="h-full w-1/3 bg-green-500/30" />
            <div className="absolute top-0 left-[85%] h-full w-1.5 bg-on-surface shadow-xl z-10 transition-all duration-1000 ease-out" />
          </div>
          <p className="text-xs font-body-sm text-on-surface-variant mt-2">
            Seu balanço entre receitas e despesas está ideal.
          </p>
        </div>

        {/* Tax Reserve */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-label-caps text-xs text-on-surface-variant font-bold tracking-wider mb-4">
            RESERVA FISCAL (IVA/IRS)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Faturação Bruta</span>
              <span className="font-code font-bold text-on-surface">{formatCurrency(2850)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Reserva Sugerida</span>
              <span className="font-code text-primary font-bold">{formatCurrency(520)}</span>
            </div>
            <div className="h-px bg-slate-100 my-1" />
            <div className="flex justify-between font-semibold">
              <span className="text-on-surface">Lucro Disponível</span>
              <span className="font-code text-green-600 font-bold">{formatCurrency(2330)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Meta Progress */}
      <section className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-title-md text-base md:text-lg font-bold">Meta Mensal</h2>
          <div className="text-right">
            <span className="font-code text-lg font-bold text-primary">{formatCurrency(2850)}</span>
            <span className="text-xs text-on-surface-variant"> / {formatCurrency(3500)}</span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000 rounded-full" style={{ width: '81%' }} />
        </div>
        <p className="text-[11px] font-label-caps text-right mt-2 text-on-surface-variant font-bold">
          81% CONCLUÍDO
        </p>
      </section>

      {/* Client Ranking (PRO) */}
      <section className="space-y-4 pb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-title-md text-lg md:text-xl font-bold">Ranking de Clientes</h2>
          <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            PRO
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-label-caps text-on-surface-variant font-bold">
                <th className="px-4 py-3">CLIENTE</th>
                <th className="px-4 py-3 text-right">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3.5 flex items-center gap-2">
                  <span className="font-bold text-primary">1.</span> TechFlow Solutions
                </td>
                <td className="px-4 py-3.5 text-right font-code font-bold text-on-surface">
                  {formatCurrency(1140)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3.5 flex items-center gap-2">
                  <span className="font-bold text-slate-400">2.</span> Oficina Central
                </td>
                <td className="px-4 py-3.5 text-right font-code font-bold text-on-surface">
                  {formatCurrency(850)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3.5 flex items-center gap-2">
                  <span className="font-bold text-amber-600">3.</span> Residencial Mar
                </td>
                <td className="px-4 py-3.5 text-right font-code font-bold text-on-surface">
                  {formatCurrency(460)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
