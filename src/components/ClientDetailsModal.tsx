import React from 'react';
import { useApp } from '../context/AppContext';

export const ClientDetailsModal: React.FC = () => {
  const {
    selectedClientForDetails,
    setSelectedClientForDetails,
    updateClient,
    formatCurrency,
    workLogs,
    setIsNewWorkModalOpen,
  } = useApp();

  if (!selectedClientForDetails) return null;

  const client = selectedClientForDetails;
  const clientLogs = workLogs.filter((w) => w.clientId === client.id);

  const handleMarkPaid = () => {
    updateClient(client.id, {
      totalBilled: client.totalBilled + client.pendingAmount,
      pendingAmount: 0,
      pendingHours: 0,
    });
    setSelectedClientForDetails({
      ...client,
      totalBilled: client.totalBilled + client.pendingAmount,
      pendingAmount: 0,
      pendingHours: 0,
    });
  };

  const toggleStatus = () => {
    const nextStatus =
      client.status === 'active' ? 'paused' : client.status === 'paused' ? 'active' : 'active';
    updateClient(client.id, { status: nextStatus });
    setSelectedClientForDetails({ ...client, status: nextStatus });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedClientForDetails(null);
      }}
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 my-auto animate-fade-in-up relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header - Fixed/Pinned */}
        <div className="flex justify-between items-start p-5 pb-3 border-b border-outline-variant/30 shrink-0 bg-surface-container-lowest">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 overflow-hidden border border-outline-variant/40">
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[28px]">
                  {client.iconType === 'rocket'
                    ? 'rocket_launch'
                    : client.iconType === 'palette'
                    ? 'palette'
                    : client.iconType === 'finance'
                    ? 'account_balance'
                    : client.iconType === 'health'
                    ? 'monitor_heart'
                    : 'business_center'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
                  {client.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    client.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : client.status === 'paused'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {client.status === 'active'
                    ? 'Ativo'
                    : client.status === 'paused'
                    ? 'Pausado'
                    : 'Novo'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Taxa Horária:{' '}
                <span className="font-code text-primary font-bold">
                  {formatCurrency(client.rate)}/h
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedClientForDetails(null)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto">

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            <span className="block font-label-caps text-[11px] text-on-surface-variant mb-1 font-semibold">
              TOTAL FATURADO
            </span>
            <p className="font-code text-xl font-bold text-secondary">
              {formatCurrency(client.totalBilled)}
            </p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            <span className="block font-label-caps text-[11px] text-on-surface-variant mb-1 font-semibold">
              PENDENTE DE PAGAMENTO
            </span>
            <div className="flex items-center gap-1.5">
              <p
                className={`font-code text-xl font-bold ${
                  client.pendingAmount > 0 ? 'text-error' : 'text-on-surface-variant'
                }`}
              >
                {formatCurrency(client.pendingAmount)}
              </p>
              {client.pendingAmount > 0 && (
                <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Contact info & notes */}
        {(client.email || client.phone || client.notes) && (
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 text-xs mb-5 space-y-1.5">
            {client.email && (
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  mail
                </span>
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  call
                </span>
                <span>{client.phone}</span>
              </div>
            )}
            {client.notes && (
              <p className="text-on-surface-variant italic pt-1 border-t border-outline-variant/20">
                "{client.notes}"
              </p>
            )}
          </div>
        )}

        {/* Recent Work Logs for this client */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-title-md text-sm font-bold text-on-surface">
              Últimos Registos de Horas
            </h4>
            <span className="text-xs text-on-surface-variant">
              {clientLogs.length} registo(s)
            </span>
          </div>

          {clientLogs.length === 0 ? (
            <div className="text-center py-6 bg-surface-container-low/60 rounded-xl border border-dashed border-outline-variant/50">
              <span className="material-symbols-outlined text-outline-variant text-[32px] mb-1">
                timer
              </span>
              <p className="text-xs text-on-surface-variant">Nenhum registo associado ainda.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {clientLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-surface rounded-xl border border-outline-variant/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-on-surface">
                      {log.date} · {log.startTime} às {log.endTime}
                    </p>
                    <p className="text-on-surface-variant text-[11px] line-clamp-1">
                      {log.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-code font-bold text-primary block">
                      {log.totalHours}h ({formatCurrency(log.totalEarnings)})
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold ${
                        log.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {log.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {client.pendingAmount > 0 && (
            <button
              onClick={handleMarkPaid}
              className="w-full h-11 bg-green-600 text-white rounded-xl font-semibold text-xs hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Dar Como Totalmente Liquidado / Pago
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedClientForDetails(null);
                setIsNewWorkModalOpen(true);
              }}
              className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Lançar Horas para Este Cliente
            </button>

            <button
              onClick={toggleStatus}
              className="px-4 h-11 bg-surface-container-high border border-outline-variant/40 text-on-surface rounded-xl font-semibold text-xs hover:bg-surface-container-highest active:scale-95 transition-all cursor-pointer"
            >
              {client.status === 'active' ? 'Pausar' : 'Ativar'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
