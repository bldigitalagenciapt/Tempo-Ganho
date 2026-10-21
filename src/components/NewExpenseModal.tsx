import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

export const NewExpenseModal: React.FC = () => {
  const { isNewExpenseModalOpen, setIsNewExpenseModalOpen, addExpense, currencySymbol } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('65.00');
  const [category, setCategory] = useState<Expense['category']>('fuel');
  const [date, setDate] = useState('2024-04-14');

  if (!isNewExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      title: title.trim(),
      amount: parseFloat(amount) || 0,
      category,
      date: new Date(date).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    setIsNewExpenseModalOpen(false);
    setTitle('');
    setAmount('65.00');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsNewExpenseModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/30 my-auto animate-fade-in-up relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header - Fixed/Pinned */}
        <div className="flex justify-between items-center p-5 pb-3 border-b border-outline-variant/20 shrink-0 bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
                Nova Despesa
              </h3>
              <p className="text-xs text-on-surface-variant">
                Registe gastos operacionais ou profissionais
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewExpenseModalOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
              DESCRIÇÃO DA DESPESA
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Combustível, Licença Figma, Almoço com cliente"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                VALOR ({currencySymbol})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-code text-sm font-semibold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant font-bold text-xs">
                  {currencySymbol}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                CATEGORIA
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Expense['category'])}
                className="w-full h-11 px-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
              >
                <option value="fuel">Combustível</option>
                <option value="tools">Ferramentas & Software</option>
                <option value="food">Alimentação</option>
                <option value="office">Escritório & Material</option>
                <option value="services">Serviços Contratados</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
              DATA
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 h-12 bg-primary text-on-primary rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Salvar Despesa
            </button>
            <button
              type="button"
              onClick={() => setIsNewExpenseModalOpen(false)}
              className="px-5 h-12 bg-surface border border-outline-variant text-on-surface rounded-xl font-semibold hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
