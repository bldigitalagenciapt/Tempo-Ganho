import React from 'react';
import { useApp } from '../context/AppContext';
import { WorkScreen } from '../screens/WorkScreen';

export const NewWorkModal: React.FC = () => {
  const { isNewWorkModalOpen, setIsNewWorkModalOpen } = useApp();

  if (!isNewWorkModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-outline-variant/30 my-8 animate-fade-in-up relative">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
            <h3 className="font-headline-lg-mobile text-lg font-bold text-primary">
              Registar Trabalho
            </h3>
          </div>
          <button
            onClick={() => setIsNewWorkModalOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <WorkScreen isModal={true} onClose={() => setIsNewWorkModalOpen(false)} />
      </div>
    </div>
  );
};
