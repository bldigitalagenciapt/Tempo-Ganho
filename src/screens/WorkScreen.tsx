import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateNetEstimate, formatEuro, SS_DISCLAIMER } from '../utils/taxCalculator';

interface WorkScreenProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const WorkScreen: React.FC<WorkScreenProps> = ({ isModal = false, onClose }) => {
  const {
    clients,
    addWorkLog,
    formatCurrency,
    currencySymbol,
    setCurrentScreen,
    workLogs,
    deleteWorkLog,
    user,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const initialClient = clients[0];

  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [pauseMinutes, setPauseMinutes] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClient?.id || 'c1');
  const [hourlyRate, setHourlyRate] = useState<string>((initialClient?.rate ?? 85).toString());
  const [retentionRate, setRetentionRate] = useState<number>(initialClient?.retentionRate ?? 25);
  const [description, setDescription] = useState('');
  const [calculatedHours, setCalculatedHours] = useState<number>(9.0);
  const [calculatedEarnings, setCalculatedEarnings] = useState<number>(765);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When client changes, auto-fill client's default rate and retention rate
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setHourlyRate(client.rate.toString());
      setRetentionRate(client.retentionRate ?? 25);
    }
  };

  // Recalculate hours and gross earnings
  useEffect(() => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const rate = parseFloat(hourlyRate) || 0;
    const pauseMs = (Number(pauseMinutes) || 0) * 60 * 1000;

    if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
      const startDate = new Date(0, 0, 0, startH, startM);
      const endDate = new Date(0, 0, 0, endH, endM);

      let diff = endDate.getTime() - startDate.getTime();
      // Handle overnight shifts
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      // Deduct pause duration
      const effectiveDiff = Math.max(0, diff - pauseMs);
      const hours = Math.round((effectiveDiff / (1000 * 60 * 60)) * 10) / 10;
      const earnings = Math.round(hours * rate * 100) / 100;

      setCalculatedHours(hours);
      setCalculatedEarnings(earnings);
    }
  }, [startTime, endTime, hourlyRate, pauseMinutes]);

  // Live tax breakdown
  const netEstimate = calculateNetEstimate(calculatedEarnings, retentionRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];

    addWorkLog({
      date,
      startTime,
      endTime,
      pauseMinutes: Number(pauseMinutes) || 0,
      clientId: client?.id || 'c1',
      clientName: client?.name || 'Cliente Direto',
      hourlyRate: parseFloat(hourlyRate) || 85,
      retentionRate: Number(retentionRate) || 0,
      totalHours: calculatedHours,
      totalEarnings: calculatedEarnings,
      description: description.trim() || 'Trabalho realizado no projeto.',
      status: 'pending',
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (isModal && onClose) {
        onClose();
      } else {
        setCurrentScreen('home');
      }
    }, 900);
  };

  return (
    <div className={isModal ? 'w-full' : 'min-h-screen pt-20 pb-32 px-4 md:px-8 max-w-2xl mx-auto'}>
      {/* Top Bar for Sub-page */}
      {!isModal && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-full transition-colors cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold font-headline-lg text-primary">
              Registar Trabalho
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant">
            <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className={isModal ? '' : 'bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-sm border border-slate-100 mb-6'}>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Date Section */}
          <div className="space-y-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
              DATA DO REGISTO
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-lg text-sm text-on-surface"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                calendar_today
              </span>
            </div>
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                HORA INÍCIO
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-lg text-sm text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                HORA FIM
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-lg text-sm text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Pause / Intervalo Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                PAUSA / INTERVALO
              </label>
              <span className="text-[11px] text-on-surface-variant/70 font-mono">
                {pauseMinutes} min deduzidos
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setPauseMinutes(mins)}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    pauseMinutes === mins
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-bright text-on-surface-variant border-outline-variant hover:bg-slate-100'
                  }`}
                >
                  {mins === 0 ? 'Sem pausa' : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Client Dropdown */}
          <div className="space-y-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
              CLIENTE
            </label>
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-body-lg text-sm text-on-surface cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {formatEuro(c.rate)}/h (IRS {c.retentionRate ?? 25}%)
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Rate and IRS Retention in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Hourly Rate */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                VALOR POR HORA (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-code text-sm font-semibold"
                  placeholder="0.00"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-sm">
                  €
                </span>
              </div>
            </div>

            {/* Retention Tax Rate */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                RETENÇÃO NA FONTE (IRS)
              </label>
              <div className="relative">
                <select
                  value={retentionRate}
                  onChange={(e) => setRetentionRate(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-3 pr-10 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-code text-sm font-semibold cursor-pointer"
                >
                  <option value={25}>25% — Taxa Geral (Serviços)</option>
                  <option value={16.5}>16.5% — Outras Atividades Cat. B</option>
                  <option value={11.5}>11.5% — Atividades Específicas</option>
                  <option value={0}>0% — Isento (Art. 53.º / Art. 9.º)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
              DESCRIÇÃO DAS ATIVIDADES
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Consultoria técnica, design de interface, desenvolvimento..."
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body-lg text-sm text-on-surface"
            />
          </div>

          {/* Live Calculated Net Breakdown Card */}
          <div className="bg-gradient-to-br from-primary/[0.04] via-surface-container-lowest to-surface-container-low/60 text-on-surface p-4 sm:p-5 rounded-2xl shadow-xs border border-primary/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  calculate
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label-caps">
                  Estimativa Financeira em Tempo Real
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {calculatedHours.toFixed(1)}h de trabalho
              </span>
            </div>

            {/* Tax Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/30 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps">Total Bruto</p>
                <p className="font-code text-base sm:text-lg font-bold text-on-surface">
                  {formatEuro(netEstimate.gross)}
                </p>
              </div>

              <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/70 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-rose-800 font-label-caps">
                  IRS ({retentionRate}%)
                </p>
                <p className="font-code text-base sm:text-lg font-bold text-rose-600">
                  - {formatEuro(netEstimate.retentionIrs)}
                </p>
              </div>

              <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-amber-900 font-label-caps">
                  Seg. Social (21,4%)
                </p>
                <p className="font-code text-base sm:text-lg font-bold text-amber-700">
                  - {formatEuro(netEstimate.socialSecurityEstimate)}
                </p>
              </div>

              <div className="bg-emerald-50/80 p-2.5 rounded-xl border-2 border-emerald-400/80 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-emerald-900 font-label-caps">
                  Líquido Estimado
                </p>
                <p className="font-code text-base sm:text-lg font-bold text-emerald-700">
                  {formatEuro(netEstimate.netEstimated)}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-on-surface-variant italic pt-1 leading-relaxed flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary">info</span>
              {SS_DISCLAIMER}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saveSuccess}
            className={`w-full h-12 sm:h-14 rounded-xl font-headline-lg text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-green-600 text-white'
                : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
              {saveSuccess ? 'check_circle' : 'save'}
            </span>
            <span>{saveSuccess ? 'Registo Salvo com Sucesso!' : 'Salvar Registo'}</span>
          </button>
        </form>
      </div>

      {/* Recent Activity List on Time Screen */}
      {!isModal && (
        <div className="mt-8">
          <h2 className="font-title-md text-lg font-bold text-on-surface mb-3">
            Histórico Recente de Horas
          </h2>
          <div className="space-y-3">
            {workLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-on-surface">{log.clientName}</p>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        log.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {log.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{log.description}</p>
                  <p className="text-[11px] text-on-surface-variant/70">
                    {log.date} · {log.startTime} às {log.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-code font-bold text-primary text-base">
                      {formatCurrency(log.totalEarnings)}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">{log.totalHours}h</p>
                  </div>
                  <button
                    onClick={() => deleteWorkLog(log.id)}
                    className="p-1 text-on-surface-variant/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title="Excluir registo"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
