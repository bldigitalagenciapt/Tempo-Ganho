import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatEuro, SS_DISCLAIMER } from '../utils/taxCalculator';

interface NetIncomeEstimatorCardProps {
  showClosingButton?: boolean;
}

export const NetIncomeEstimatorCard: React.FC<NetIncomeEstimatorCardProps> = ({
  showClosingButton = true,
}) => {
  const { workLogs, clients, stats, setIsPeriodClosingModalOpen } = useApp();
  const [scope, setScope] = useState<'month' | 'all'>('month');

  // Filter logs for this month if scope is 'month'
  const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const activeLogs = scope === 'month'
    ? workLogs.filter((w) => w.date && w.date.startsWith(currentMonthStr))
    : workLogs;

  const grossRevenue = activeLogs.reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
  const totalHours = activeLogs.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  const irsRetention = activeLogs.reduce((acc, curr) => {
    const client = clients.find((c) => c.id === curr.clientId);
    const rate = curr.retentionRate ?? client?.retentionRate ?? 25;
    return acc + Math.round(curr.totalEarnings * (rate / 100) * 100) / 100;
  }, 0);

  // Previsão SS: (Bruto * 0.70) * 0.214
  const socialSecurity = Math.round((grossRevenue * 0.70) * 0.214 * 100) / 100;
  const netEstimated = Math.max(0, grossRevenue - irsRetention - socialSecurity);

  // Percentages for visual breakdown
  const irsPercent = grossRevenue > 0 ? Math.round((irsRetention / grossRevenue) * 100) : 0;
  const ssPercent = grossRevenue > 0 ? Math.round((socialSecurity / grossRevenue) * 100) : 15;
  const netPercent = grossRevenue > 0 ? Math.max(0, 100 - irsPercent - ssPercent) : 85;

  return (
    <div className="bg-gradient-to-br from-primary/[0.04] via-surface-container-lowest to-surface-container-low/60 p-5 md:p-6 rounded-2xl shadow-sm border border-primary/20 text-on-surface relative overflow-hidden">
      {/* Header with Title and Scope Toggle */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">
              account_balance_wallet
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold font-headline-lg tracking-tight text-on-surface">
                Estimativa de Líquido Real
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Recibos Verdes
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Decomposição de impostos e estimativa para recibos verdes em Portugal
            </p>
          </div>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setScope('month')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              scope === 'month'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Este Mês
          </button>
          <button
            type="button"
            onClick={() => setScope('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              scope === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Total Acumulado
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
        {/* Total Bruto */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">
              Total Bruto Faturado
            </span>
            <span className="text-[11px] font-mono text-primary font-semibold">
              {totalHours.toFixed(1)}h
            </span>
          </div>
          <p className="font-code text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            {formatEuro(grossRevenue)}
          </p>
          <span className="text-[10px] text-on-surface-variant mt-1 block">
            Horas × Valor do Cliente
          </span>
        </div>

        {/* Retenção IRS */}
        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/70 hover:border-rose-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-800 font-label-caps">
              Retenção na Fonte (IRS)
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
              dedução
            </span>
          </div>
          <p className="font-code text-xl sm:text-2xl font-bold text-rose-600 tracking-tight">
            - {formatEuro(irsRetention)}
          </p>
          <span className="text-[10px] text-rose-700/80 mt-1 block">
            Taxa média: ~{irsPercent}% do bruto
          </span>
        </div>

        {/* Previsão Segurança Social */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 hover:border-amber-300 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-900 font-label-caps">
              Previsão Seg. Social
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
              21,4%
            </span>
          </div>
          <p className="font-code text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">
            - {formatEuro(socialSecurity)}
          </p>
          <span className="text-[10px] text-amber-800/80 mt-1 block">
            70% rendimento × 21,4%
          </span>
        </div>

        {/* Líquido Estimado Final */}
        <div className="bg-emerald-50/80 p-4 rounded-xl border-2 border-emerald-400/80 hover:border-emerald-500 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900 font-label-caps">
              Líquido Estimado Final
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
              {netPercent}% real
            </span>
          </div>
          <p className="font-code text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">
            {formatEuro(netEstimated)}
          </p>
          <span className="text-[10px] text-emerald-800/80 mt-1 block">
            Bruto - IRS - Seg. Social
          </span>
        </div>
      </div>

      {/* Visual Proportional Bar */}
      <div className="relative z-10 space-y-1.5 pt-1">
        <div className="w-full bg-slate-100 border border-slate-200/80 h-3 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${netPercent}%` }}
            className="bg-emerald-500 h-full transition-all duration-700"
            title={`Líquido: ${netPercent}%`}
          />
          <div
            style={{ width: `${irsPercent}%` }}
            className="bg-rose-400 h-full transition-all duration-700"
            title={`Retenção IRS: ${irsPercent}%`}
          />
          <div
            style={{ width: `${ssPercent}%` }}
            className="bg-amber-400 h-full transition-all duration-700"
            title={`Segurança Social: ${ssPercent}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Líquido ({netPercent}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            IRS ({irsPercent}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Seg. Social ({ssPercent}%)
          </span>
        </div>
      </div>

      {/* Footer Note & Quick Action */}
      <div className="relative z-10 mt-4 pt-3.5 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[11px] text-on-surface-variant italic flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-primary">info</span>
          {SS_DISCLAIMER}
        </p>

        {showClosingButton && (
          <button
            type="button"
            onClick={() => setIsPeriodClosingModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-primary hover:brightness-110 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
            <span>Fecho do Mês & WhatsApp/PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
