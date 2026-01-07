import { createContext } from 'react';

export type ToastLevel = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  level: ToastLevel;
  message: string;
  duration: number;
}

interface ToastContextValue {
  toast: (level: ToastLevel, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
