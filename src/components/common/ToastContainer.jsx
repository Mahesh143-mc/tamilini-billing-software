import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ToastContainer = () => {
  const { toasts } = usePOS();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-2.5 max-w-md w-[90%] sm:w-full pointer-events-none px-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center space-x-3 bg-brand-dark/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-purple-glow border border-purple-500/40 animate-slide-down w-full"
        >
          {getIcon(toast.type)}
          <span className="text-xs sm:text-sm font-bold tracking-wide leading-snug flex-1">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
};
