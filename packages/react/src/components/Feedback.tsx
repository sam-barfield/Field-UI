import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { IconButton } from './Button';
import { useThemeSafe } from '../theme';

/* --- ALERT --- */
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
}) => {
  const defaultIcons = {
    info: <Info size={18} />,
    success: <CheckCircle2 size={18} />,
    warning: <AlertTriangle size={18} />,
    danger: <AlertCircle size={18} />,
  };

  return (
    <div className={`field-alert field-alert-${variant} ${className}`} role="alert">
      <span className="field-alert-icon">{icon || defaultIcons[variant]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div className="field-alert-title">{title}</div>}
        <div className="field-alert-content">{children}</div>
      </div>
      {onClose && (
        <IconButton
          icon={<X size={14} />}
          variant="ghost"
          size="sm"
          aria-label="Dismiss alert"
          onClick={onClose}
        />
      )}
    </div>
  );
};

/* --- TOAST --- */
export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: AlertVariant;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
  className?: string;
}

let toastCounter = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  container,
  className = '',
}) => {
  const { theme } = useThemeSafe();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      toastCounter += 1;
      const id = `toast-${Date.now()}-${toastCounter}`;
      setToasts(prev => [...prev, { id, title, description, variant, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const contextValue = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  const portalTarget = container || (typeof document !== 'undefined' ? document.body : null);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalTarget &&
        createPortal(
          <div
            className={`field-toast-container field-scope ${className}`.trim()}
            data-field-theme={theme.id}
            data-theme={theme.mode}
          >
            {toasts.map(toast => (
              <div key={toast.id} className="field-toast-item">
                <div className="field-toast-body">
                  <div className="field-toast-title">{toast.title}</div>
                  {toast.description && <div className="field-toast-desc">{toast.description}</div>}
                </div>
                <IconButton
                  icon={<X size={14} />}
                  variant="ghost"
                  size="sm"
                  aria-label="Dismiss toast"
                  onClick={() => dismissToast(toast.id)}
                />
              </div>
            ))}
          </div>,
          portalTarget
        )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
};
