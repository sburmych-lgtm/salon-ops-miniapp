import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md max-w-[90vw] animate-in fade-in slide-in-from-top-4 duration-200">
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 -mr-1 text-slate-400 hover:text-white rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
