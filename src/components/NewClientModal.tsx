import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

export const NewClientModal: React.FC = () => {
  const { isNewClientModalOpen, setIsNewClientModalOpen, addClient, currencySymbol } = useApp();

  const [name, setName] = useState('');
  const [rate, setRate] = useState('180');
  const [initialBilled, setInitialBilled] = useState('0');
  const [initialPending, setInitialPending] = useState('0');
  const [status, setStatus] = useState<Client['status']>('active');
  const [iconType, setIconType] = useState<Client['iconType']>('rocket');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isNewClientModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      rate: parseFloat(rate) || 100,
      totalBilled: parseFloat(initialBilled) || 0,
      pendingAmount: parseFloat(initialPending) || 0,
      status,
      iconType,
      email: email.trim(),
      phone: phone.trim(),
      pendingHours: Math.round((parseFloat(initialPending) || 0) / (parseFloat(rate) || 100)),
    });

    setIsNewClientModalOpen(false);
    // Reset form
    setName('');
    setRate('180');
    setInitialBilled('0');
    setInitialPending('0');
    setEmail('');
    setPhone('');
  };

  const icons: { type: Client['iconType']; label: string; icon: string }[] = [
    { type: 'rocket', label: 'Tech & Inovação', icon: 'rocket_launch' },
    { type: 'palette', label: 'Design & Criativo', icon: 'palette' },
    { type: 'finance', label: 'Finanças', icon: 'account_balance' },
    { type: 'health', label: 'Saúde & Bio', icon: 'monitor_heart' },
    { type: 'code', label: 'Software Dev', icon: 'terminal' },
    { type: 'briefcase', label: 'Consultoria', icon: 'business_center' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/30 my-8 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
                Adicionar Novo Cliente
              </h3>
              <p className="text-xs text-on-surface-variant">
                Configure a taxa horária e dados de faturação
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewClientModalOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
              NOME DA EMPRESA / CLIENTE
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Acme Innovations Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                VALOR POR HORA ({currencySymbol})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-code text-sm font-semibold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-xs">
                  {currencySymbol}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                ESTADO DO CLIENTE
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Client['status'])}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
              >
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="new">Novo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1.5 font-semibold">
              ÍCONE / SETOR DO CLIENTE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {icons.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setIconType(item.type)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    iconType === item.type
                      ? 'border-primary bg-primary/10 text-primary shadow-sm font-bold'
                      : 'border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-[10px] text-center leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                TOTAL JÁ FATURADO ({currencySymbol})
              </label>
              <input
                type="number"
                value={initialBilled}
                onChange={(e) => setInitialBilled(e.target.value)}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-code text-sm"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                PENDENTE ATUAL ({currencySymbol})
              </label>
              <input
                type="number"
                value={initialPending}
                onChange={(e) => setInitialPending(e.target.value)}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-code text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                EMAIL DE CONTACTO
              </label>
              <input
                type="email"
                placeholder="faturas@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                TELEFONE
              </label>
              <input
                type="tel"
                placeholder="+351 912 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 h-12 bg-primary text-on-primary rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Salvar Cliente
            </button>
            <button
              type="button"
              onClick={() => setIsNewClientModalOpen(false)}
              className="px-5 h-12 bg-surface border border-outline-variant text-on-surface rounded-xl font-semibold hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
