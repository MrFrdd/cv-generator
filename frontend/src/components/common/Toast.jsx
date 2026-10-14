import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-rose-50 border-rose-300 text-rose-900',
    info: 'bg-sky-50 border-sky-300 text-sky-900'
  };

  const iconStyles = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up no-print">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${bgStyles[type] || bgStyles.info}`}
      >
        {iconStyles[type] || iconStyles.info}
        <p className="text-xs font-medium leading-relaxed flex-1">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
