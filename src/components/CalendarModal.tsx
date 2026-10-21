import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CalendarModal: React.FC = () => {
  const { isCalendarModalOpen, setIsCalendarModalOpen, workLogs, setCurrentScreen } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2024-04-10');

  if (!isCalendarModalOpen) return null;

  const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const aprilDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Check which days have logged hours
  const loggedDays = new Set(
    workLogs.map((log) => {
      const parts = log.date.split('-');
      return parseInt(parts[2], 10);
    })
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCalendarModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-outline-variant/40 my-auto animate-fade-in-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-label-caps text-xs text-primary uppercase font-bold tracking-wider">
              CALENDÁRIO DE TRABALHO
            </span>
            <h3 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
              Abril 2024
            </h3>
          </div>
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day) => (
            <span key={day} className="font-label-caps text-[11px] text-on-surface-variant/70 font-semibold py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-6">
          {/* Offset for starting on Monday (Abril 2024 starts on Monday, so index 1) */}
          <div className="p-2" />
          {aprilDays.map((day) => {
            const isSelected = day === 10;
            const hasWork = loggedDays.has(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(`2024-04-${String(day).padStart(2, '0')}`)}
                className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer text-sm font-semibold ${
                  isSelected
                    ? 'bg-primary text-white shadow-md scale-105'
                    : hasWork
                    ? 'bg-primary-container/15 text-primary hover:bg-primary-container/25'
                    : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <span>{day}</span>
                {hasWork && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick summary for selected day */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface">Atividades em 10 de Abril:</span>
            <span className="font-bold text-primary">9.0h registadas (€ 765)</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Tech Solutions Inc. — Design system e componentes
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsCalendarModalOpen(false);
              setCurrentScreen('time');
            }}
            className="flex-1 py-3 bg-primary-container text-on-primary-container rounded-xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Registar Horas Neste Dia
          </button>
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="px-4 py-3 bg-surface border border-outline-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-container-low active:scale-95 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
