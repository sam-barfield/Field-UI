import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}) => {
  const id = useId();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen && typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const maxWidths = {
    sm: '400px',
    md: '540px',
    lg: '720px',
    full: '92vw',
  };

  const modalNode = (
    <div
      className="field-modal-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={description ? `${id}-desc` : undefined}
    >
      <div className="field-modal-content" style={{ maxWidth: maxWidths[size] }}>
        {(title || showCloseButton) && (
          <div className="field-modal-header">
            <div>
              {title && (
                <h3 id={`${id}-title`} className="field-heading field-heading-3">
                  {title}
                </h3>
              )}
              {description && (
                <p id={`${id}-desc`} className="field-text-sm field-text-secondary" style={{ marginTop: '2px' }}>
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={<X size={16} />}
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
                onClick={onClose}
              />
            )}
          </div>
        )}
        <div className="field-modal-body">{children}</div>
        {footer && <div className="field-modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = '420px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen && typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const drawerNode = (
    <>
      <div className="field-drawer-backdrop" onClick={onClose} />
      <div className="field-drawer-panel" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="field-modal-header">
          {title && <h3 className="field-heading field-heading-3">{title}</h3>}
          <IconButton
            icon={<X size={16} />}
            variant="ghost"
            size="sm"
            aria-label="Close drawer"
            onClick={onClose}
          />
        </div>
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>{children}</div>
        {footer && <div className="field-modal-footer">{footer}</div>}
      </div>
    </>
  );

  return createPortal(drawerNode, document.body);
};

