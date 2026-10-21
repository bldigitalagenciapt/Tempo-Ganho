import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

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

  const [date, setDate] = useState('2023-10-27');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [selectedClientId, setSelectedClientId] = useState<string>('c1');
  const [hourlyRate, setHourlyRate] = useState<string>('85.00');
  const [description, setDescription] = useState('');
  const [calculatedHours, setCalculatedHours] = useState<number>(9.0);
  const [calculatedEarnings, setCalculatedEarnings] = useState<number>(765);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When client changes, auto-fill client's default rate
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setHourlyRate(client.rate.toString());
    }
  };

  // Recalculate hours and earnings
  useEffect(() => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const rate = parseFloat(hourlyRate) || 0;

    if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
      const startDate = new Date(0, 0, 0, startH, startM);
      const endDate = new Date(0, 0, 0, endH, endM);

      let diff = endDate.getTime() - startDate.getTime();
      // Handle overnight shifts
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      const hours = Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
      const earnings = Math.round(hours * rate * 100) / 100;

      setCalculatedHours(hours);
      setCalculatedEarnings(earnings);
    }
  }, [startTime, endTime, hourlyRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];

    addWorkLog({
      date,
      startTime,
      endTime,
      clientId: client?.id || 'c1',
      clientName: client?.name || 'Cliente Direto',
      hourlyRate: parseFloat(hourlyRate) || 85,
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
              DATA
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
                    {c.name} ({formatCurrency(c.rate)}/h)
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="space-y-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
              VALOR POR HORA ({currencySymbol})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-code text-sm font-semibold"
                placeholder="0.00"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-sm">
                {currencySymbol}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
              DESCRIÇÃO
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que você realizou hoje?"
              className="w-full p-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body-lg text-sm text-on-surface"
            />
          </div>

          {/* Live Calculated Stats */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-primary-container/10 p-3.5 sm:p-4 rounded-xl border border-primary-container/20 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">timer</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-caps text-[10px] sm:text-xs text-primary uppercase font-bold tracking-wider truncate">
                  Total de Horas
                </p>
                <p className="font-headline-lg text-lg sm:text-2xl font-bold text-primary font-code">
                  {calculatedHours.toFixed(1)}h
                </p>
              </div>
            </div>

            <div className="bg-secondary-container/10 p-3.5 sm:p-4 rounded-xl border border-secondary-container/20 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">payments</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-caps text-[10px] sm:text-xs text-secondary uppercase font-bold tracking-wider truncate">
                  Ganhos Totais
                </p>
                <p className="font-headline-lg text-lg sm:text-2xl font-bold text-secondary font-code truncate">
                  {formatCurrency(calculatedEarnings)}
                </p>
              </div>
            </div>
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
            <span>{saveSuccess ? 'Registo Salvo com Sucesso!' : 'Salvar Registro'}</span>
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
