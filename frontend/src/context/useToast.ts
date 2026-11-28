import { useContext } from 'react';
import { ToastContext, type ToastContextValue, toast } from './ToastContext';

export const useToast = (): ToastContextValue & { toast: typeof toast } => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return { ...context, toast };
};

export { toast };
