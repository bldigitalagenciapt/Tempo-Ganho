import React from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

export const ClientsScreen: React.FC = () => {
  const {
    clients,
    formatCurrency,
    setSelectedClientForDetails,
    setIsNewClientModalOpen,
  } = useApp();

  return (
    <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-xs text-on-surface-variant tracking-widest font-bold">
            ECOSSISTEMA
          </span>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-background mt-1">
            Seus Clientes
          </h2>
        </div>
        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="bg-primary-container text-on-primary-container px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
          <span className="font-label-caps text-xs font-semibold">Novo Cliente</span>
        </button>
      </div>

      {/* Client Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render Clients with dynamic card indices */}
        {clients.map((client, index) => {
          // Render the Metric Banner Card in the middle (after 2nd card) for visual rhythm as shown in mockup
          const showMetricCardBefore = index === 2;

          return (
            <React.Fragment key={client.id}>
              {showMetricCardBefore && (
                <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <h3 className="font-headline-lg-mobile text-xl font-bold mb-4">
                      Meta Mensal
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between font-label-caps text-xs mb-1.5 font-semibold">
                          <span>PROGRESSO</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="font-display-lg text-3xl font-bold">12k</span>
                        <span className="font-label-caps text-xs opacity-75">DE 16k</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="font-body-sm text-xs opacity-85 leading-relaxed">
                      Você faturou 15% a mais que no mesmo período do mês passado.
                    </p>
                  </div>
                </div>
              )}

              {/* Client Bento Card */}
              <div className="glass-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 overflow-hidden border border-outline-variant/30">
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {client.iconType === 'rocket'
                          ? 'rocket_launch'
                          : client.iconType === 'palette'
                          ? 'palette'
                          : client.iconType === 'finance'
                          ? 'account_balance'
                          : client.iconType === 'health'
                          ? 'monitor_heart'
                          : client.iconType === 'code'
                          ? 'terminal'
                          : 'business_center'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-title-md text-base md:text-lg font-bold text-on-surface truncate">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mt-0.5">
                      <span className="font-label-caps text-xs uppercase tracking-tighter">Taxa:</span>
                      <span className="font-code text-primary font-bold">
                        {formatCurrency(client.rate)}/h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="block font-label-caps text-[11px] text-on-surface-variant font-semibold mb-1">
                      FATURADO TOTAL
                    </span>
                    <p className="font-code text-lg font-bold text-secondary">
                      {formatCurrency(client.totalBilled)}
                    </p>
                  </div>
                  <div>
                    <span className="block font-label-caps text-[11px] text-on-surface-variant font-semibold mb-1">
                      PENDENTE
                    </span>
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`font-code text-lg font-bold ${
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

                <div className="mt-5 flex justify-between items-center pt-2">
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                      client.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : client.status === 'paused'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}
                  >
                    {client.status === 'active'
                      ? 'Ativo'
                      : client.status === 'paused'
                      ? 'Pausado'
                      : 'Novo'}
                  </span>

                  <button
                    onClick={() => setSelectedClientForDetails(client)}
                    className="text-primary font-label-caps text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>VER DETALHES</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Empty State / Add Card */}
        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="border-2 border-dashed border-outline-variant/60 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer active:scale-95 group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors text-primary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">person_add</span>
          </div>
          <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
            Adicionar Novo Cliente
          </span>
        </button>
      </div>
    </main>
  );
};
