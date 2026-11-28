import React, { createContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { ToastContainer } from '../components/common/ToastContainer';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  isExiting?: boolean;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

// Global dispatcher to allow calling toast from non-component utilities (e.g. AuthContext)
type ToastListener = (message: string, type: ToastType, duration?: number) => void;
let globalToastListener: ToastListener | null = null;

export const toast = {
  success: (message: string, duration = 2800) => {
    globalToastListener?.(message, 'success', duration);
  },
  warning: (message: string, duration = 2800) => {
    globalToastListener?.(message, 'warning', duration);
  },
  error: (message: string, duration = 3000) => {
    globalToastListener?.(message, 'error', duration);
  },
  info: (message: string, duration = 2800) => {
    globalToastListener?.(message, 'info', duration);
  },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Set exiting animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // Completely remove after animation completes (240ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      const existingTimeout = timeoutsRef.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        timeoutsRef.current.delete(id);
      }
    }, 240);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 2800) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = {
        id,
        message,
        type,
        duration,
        isExiting: false,
      };

      setToasts((prev) => {
        // Keep at most 3 toasts on screen simultaneously to prevent layout clutter
        const next = [...prev, newToast];
        if (next.length > 3) {
          return next.slice(next.length - 3);
        }
        return next;
      });

      // Auto dismiss after specified duration
      const timeout = setTimeout(() => {
        removeToast(id);
      }, duration);

      timeoutsRef.current.set(id, timeout);
    },
    [removeToast]
  );

  // Connect global toast listener
  React.useEffect(() => {
    globalToastListener = showToast;
    return () => {
      globalToastListener = null;
    };
  }, [showToast]);

  const value: ToastContextValue = {
    showToast,
    removeToast,
    success: (msg, dur) => showToast(msg, 'success', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
