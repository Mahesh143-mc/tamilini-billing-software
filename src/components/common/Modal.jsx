import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, icon: Icon, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden z-10 animate-scale-in my-auto max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-dark via-purple-950 to-brand-dark text-white px-5 py-4 flex items-center justify-between border-b border-purple-800/40 shrink-0">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-purple-glow shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">{title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors min-h-touch min-w-touch flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
