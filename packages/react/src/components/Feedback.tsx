import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { IconButton } from './Button';

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

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, title, description, variant, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--field-surface-overlay)',
              border: '1px solid var(--field-border-strong)',
              borderRadius: 'var(--field-radius-lg)',
              padding: '12px 16px',
              boxShadow: 'var(--field-shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'fieldScaleIn 0.2s ease',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--field-text-primary)' }}>
                {toast.title}
              </div>
              {toast.description && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--field-text-secondary)', marginTop: '2px' }}>
                  {toast.description}
                </div>
              )}
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
      </div>
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
