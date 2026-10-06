'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { IconButton } from './Button.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- ALERT --- */
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Replace the default variant icon. Pass `null` to hide it. */
  icon?: React.ReactNode;
  /** Shows a dismiss button. */
  onClose?: () => void;
  /** Optional actions rendered under the message (e.g. a "Retry" button). */
  actions?: React.ReactNode;
  className?: string;
}

const ALERT_ICONS: Record<AlertVariant, React.ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  danger: <AlertCircle size={18} />,
};

/**
 * An inline message for page- or section-level status. Danger and warning
 * alerts are announced immediately (`role="alert"`); info and success use the
 * polite `role="status"`.
 *
 * @example
 * <Alert variant="warning" title="Quota at 90%">Upgrade to avoid throttling.</Alert>
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  actions,
  className = '',
}) => {
  const resolvedIcon = icon === undefined ? ALERT_ICONS[variant] : icon;
  return (
    <div
      className={mergeClassNames('field-alert', `field-alert-${variant}`, className)}
      role={variant === 'danger' || variant === 'warning' ? 'alert' : 'status'}
    >
      {resolvedIcon && <span className="field-alert-icon" aria-hidden="true">{resolvedIcon}</span>}
      <div className="field-alert-body">
        {title && <div className="field-alert-title">{title}</div>}
        {children && <div className="field-alert-content">{children}</div>}
        {actions && <div className="field-alert-actions">{actions}</div>}
      </div>
      {onClose && (
        <IconButton icon={<X size={14} />} variant="ghost" size="sm" aria-label="Dismiss alert" onClick={onClose} />
      )}
    </div>
  );
};

/* --- TOAST --- */
export interface ToastItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: AlertVariant;
  /** Auto-dismiss after this many ms. `0` keeps the toast until dismissed. Default 4000. */
  duration?: number;
  /** Optional action button, e.g. `{ label: 'Undo', onClick: undo }`. */
  action?: { label: string; onClick: () => void };
}

export type ToastOptions = Omit<ToastItem, 'id'> & { id?: string };

export interface ToastContextValue {
  /** Show a toast. Returns its id (pass `id` to replace an existing toast). */
  showToast: (toast: ToastOptions) => string;
  dismissToast: (id: string) => void;
  /** Remove every visible toast. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Screen corner for the stack. Default `bottom-right`. */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Maximum toasts on screen; older ones are dropped. Default 5. */
  limit?: number;
  container?: HTMLElement | null;
  className?: string;
}

let toastCounter = 0;

/**
 * Hosts transient notifications. Wrap your app once, then call
 * `useToast().showToast(...)` anywhere below it.
 *
 * @example
 * const { showToast } = useToast();
 * showToast({ title: 'Saved', variant: 'success' });
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  limit = 5,
  container,
  className = '',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const portalProps = usePortalThemeProps(
    mergeClassNames('field-toast-container', `field-toast-${position}`, className)
  );

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({ id: requestedId, variant = 'info', duration = 4000, ...rest }: ToastOptions) => {
      toastCounter += 1;
      const id = requestedId ?? `toast-${Date.now()}-${toastCounter}`;
      const existingTimer = timers.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      setToasts(prev => {
        const next = [...prev.filter(t => t.id !== id), { id, variant, duration, ...rest }];
        return next.slice(-limit);
      });

      if (duration > 0) {
        timers.current.set(id, setTimeout(() => dismissToast(id), duration));
      }
      return id;
    },
    [dismissToast, limit]
  );

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  const contextValue = useMemo(() => ({ showToast, dismissToast, dismissAll }), [showToast, dismissToast, dismissAll]);
  const portalTarget = getPortalTarget(container);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalTarget &&
        createPortal(
          <div {...portalProps} role="region" aria-label="Notifications" aria-live="polite">
            {toasts.map(toast => (
              <div
                key={toast.id}
                className={mergeClassNames('field-toast-item', `field-toast-${toast.variant}`)}
                role={toast.variant === 'danger' ? 'alert' : 'status'}
              >
                <span className="field-toast-icon" aria-hidden="true">
                  {ALERT_ICONS[toast.variant ?? 'info']}
                </span>
                <div className="field-toast-body">
                  <div className="field-toast-title">{toast.title}</div>
                  {toast.description && <div className="field-toast-desc">{toast.description}</div>}
                  {toast.action && (
                    <button
                      type="button"
                      className="field-toast-action"
                      onClick={() => {
                        toast.action?.onClick();
                        dismissToast(toast.id);
                      }}
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <IconButton
                  icon={<X size={14} />}
                  variant="ghost"
                  size="sm"
                  aria-label="Dismiss notification"
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

/** Show and dismiss toasts. Must be used inside `<ToastProvider>`. */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
};
