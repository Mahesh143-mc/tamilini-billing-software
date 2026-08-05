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
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center space-x-3 bg-brand-dark text-white px-4 py-3 rounded-2xl shadow-purple-lg border border-purple-800/80 animate-slide-up"
        >
          {getIcon(toast.type)}
          <span className="text-xs sm:text-sm font-medium tracking-wide leading-snug flex-1">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
};
