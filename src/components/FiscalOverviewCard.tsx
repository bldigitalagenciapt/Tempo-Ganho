import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatEuro,
  getIvaExemptionStatus,
  getQuarterlyRevenue,
  QUARTERS_INFO,
  VAT_EXEMPTION_LIMIT_ART53,
} from '../utils/taxCalculator';

export const FiscalOverviewCard: React.FC = () => {
  const { workLogs } = useApp();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed
  const defaultQuarter: 1 | 2 | 3 | 4 = currentMonth < 3 ? 1 : currentMonth < 6 ? 2 : currentMonth < 9 ? 3 : 4;

  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(defaultQuarter);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [copiedValue, setCopiedValue] = useState(false);

  // Calculate annual revenue for IVA Art. 53.º
  const yearlyRevenue = useMemo(() => {
    return workLogs
      .filter((log) => {
        if (!log.date) return false;
        const [logYear] = log.date.split('-').map(Number);
        return logYear === selectedYear;
      })
      .reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
  }, [workLogs, selectedYear]);

  // IVA Exemption Status
  const ivaStatus = getIvaExemptionStatus(yearlyRevenue);

  // SS Quarterly Revenue
  const quarterlyData = useMemo(() => {
    return getQuarterlyRevenue(workLogs, selectedYear, selectedQuarter);
  }, [workLogs, selectedYear, selectedQuarter]);

  const handleCopyQuarterlyRevenue = async () => {
    try {
      await navigator.clipboard.writeText(quarterlyData.totalGrossRevenue.toFixed(2));
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    } catch {
      // Fallback
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/40 p-5 md:p-6 space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold font-headline-lg text-on-surface">
              Resumo Fiscal & Conformidade Portuguesa
            </h2>
            <p className="text-xs text-on-surface-variant">
              Segurança Social Direta e Teto de Isenção do IVA (Art. 53.º)
            </p>
          </div>
        </div>

        {/* Year Badge / Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-on-surface-variant">Ano Fiscal:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-8 px-2.5 text-xs font-bold rounded-lg border border-outline-variant bg-surface-bright text-on-surface cursor-pointer"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
            <option value={2023}>2023</option>
          </select>
        </div>
      </div>

      {/* 1. SEÇÃO IVA ART. 53.º */}
      <div className="space-y-3 p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              verified_user
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label-caps">
              Teto de Isenção de IVA (Art. 53.º do CIVA)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ivaStatus.isExceeded ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                Teto Ultrapassado (&gt; 15.000 €)
              </span>
            ) : ivaStatus.isWarning ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                Atenção: Atingiu {ivaStatus.percentage}% do teto!
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Isento de IVA ({ivaStatus.percentage}%)
              </span>
            )}
          </div>
        </div>

        {/* Values and Limit */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-xl sm:text-2xl font-bold font-code text-on-surface">
              {formatEuro(ivaStatus.currentRevenue)}
            </span>
            <span className="text-xs text-on-surface-variant font-medium ml-1.5">
              faturados em {selectedYear}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-on-surface-variant font-semibold">Teto Máximo: </span>
            <span className="text-xs font-code font-bold text-on-surface">
              {formatEuro(VAT_EXEMPTION_LIMIT_ART53)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high h-3.5 rounded-full overflow-hidden p-0.5 border border-outline-variant/40 shadow-inner">
          <div
            style={{ width: `${Math.min(100, ivaStatus.percentage)}%` }}
            className={`h-full rounded-full transition-all duration-700 ${
              ivaStatus.isExceeded
                ? 'bg-rose-500 shadow-sm'
                : ivaStatus.isWarning
                ? 'bg-amber-500 shadow-sm'
                : 'bg-primary'
            }`}
          />
        </div>

        {/* Info & Warning Banner */}
        {ivaStatus.isWarning && !ivaStatus.isExceeded && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg flex items-start gap-2.5 text-xs">
            <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">
              warning
            </span>
            <p className="leading-relaxed">
              <strong>Alerta de Teto Fiscal (Art. 53.º):</strong> Ultrapassou 80% do limite anual de 15.000 €. Se ultrapassar este montante durante o ano, terá de começar a cobrar IVA a partir de janeiro do ano seguinte ou mediante comunicação às Finanças.
            </p>
          </div>
        )}

        {ivaStatus.isExceeded && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg flex items-start gap-2.5 text-xs">
            <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0 mt-0.5">
              error
            </span>
            <p className="leading-relaxed">
              <strong>Limite de 15.000 € Ultrapassado:</strong> O regime de isenção do Art. 53.º cessará. Consulte o seu contabilista certificado para proceder à entrega da declaração de alterações de atividade.
            </p>
          </div>
        )}

        {!ivaStatus.isWarning && !ivaStatus.isExceeded && (
          <p className="text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>Margem restante para faturar com isenção:</span>
            <strong className="text-on-surface font-code">{formatEuro(ivaStatus.remaining)}</strong>
          </p>
        )}
      </div>

      {/* 2. SEÇÃO DECLARAÇÃO TRIMESTRAL DA SEGURANÇA SOCIAL DIRETA (Tema Claro & Coeso) */}
      <div className="space-y-4 p-4 md:p-5 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              assignment
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label-caps">
              Declaração Trimestral da Segurança Social Direta
            </span>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
            {quarterlyData.quarterInfo.submissionMonth}
          </span>
        </div>

        {/* Trimestres Selector Buttons (T1, T2, T3, T4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUARTERS_INFO.map((q) => {
            const isSelected = selectedQuarter === q.quarter;
            return (
              <button
                key={q.quarter}
                type="button"
                onClick={() => setSelectedQuarter(q.quarter)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high hover:text-on-surface shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-on-surface'}`}>
                    T{q.quarter}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
                  )}
                </div>
                <p className={`text-[11px] truncate ${isSelected ? 'text-white/90 font-medium' : 'text-on-surface-variant'}`}>
                  {q.monthsLabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quarterly Breakdown Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Faturamento Total do Trimestre */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps">
              Faturado no Trimestre
            </p>
            <p className="font-code text-xl sm:text-2xl font-bold text-primary mt-1">
              {formatEuro(quarterlyData.totalGrossRevenue)}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1">
              {quarterlyData.logsCount} registos de serviços
            </p>
          </div>

          {/* Rendimento Relevante (70%) */}
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps">
              Rendimento Relevante (70%)
            </p>
            <p className="font-code text-xl sm:text-2xl font-bold text-secondary mt-1">
              {formatEuro(quarterlyData.relevantIncome70)}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1">
              Base de incidência contributiva
            </p>
          </div>

          {/* Contribuição Mensal Estimada */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 font-label-caps">
              Contribuição Mensal Estimada
            </p>
            <p className="font-code text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ~ {formatEuro(quarterlyData.estimatedMonthlyPayment)} /mês
            </p>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">
              Para os 3 meses seguintes (21,4%)
            </p>
          </div>
        </div>

        {/* Quick Action to copy quarterly amount */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-on-surface-variant italic">
            Valor a preencher no campo de prestação de serviços no portal da SS Direta.
          </p>

          <button
            type="button"
            onClick={handleCopyQuarterlyRevenue}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {copiedValue ? 'done' : 'content_copy'}
            </span>
            <span>
              {copiedValue ? 'Valor Copiado!' : 'Copiar Faturação do Trimestre'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
