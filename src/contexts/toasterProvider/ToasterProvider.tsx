import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './ToastContext';
import type { Toast, ToastLevel } from './ToastContext';
import Toaster from './Toaster';

function getDuration(message: string) {
  const base = 5000;
  const extra = Math.min(message.length * 50, 5000);
  return base + extra;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (level: ToastLevel, message: string) => {
      const id = crypto.randomUUID();
      const duration = getDuration(message);

      setToasts((prev) => [...prev, { id, level, message, duration }]);

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(<Toaster toasts={toasts} onClose={removeToast} />, document.body)}
    </ToastContext.Provider>
  );
}
