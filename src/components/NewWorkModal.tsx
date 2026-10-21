import React from 'react';
import { useApp } from '../context/AppContext';
import { WorkScreen } from '../screens/WorkScreen';

export const NewWorkModal: React.FC = () => {
  const { isNewWorkModalOpen, setIsNewWorkModalOpen } = useApp();

  if (!isNewWorkModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsNewWorkModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 my-auto animate-fade-in-up relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header - Fixed/Pinned */}
        <div className="flex justify-between items-center p-5 pb-3 border-b border-outline-variant/20 shrink-0 bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
            <h3 className="font-headline-lg-mobile text-lg font-bold text-primary">
              Registar Trabalho
            </h3>
          </div>
          <button
            onClick={() => setIsNewWorkModalOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 pt-4 overflow-y-auto">
          <WorkScreen isModal={true} onClose={() => setIsNewWorkModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};
