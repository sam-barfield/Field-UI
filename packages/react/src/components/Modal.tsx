'use client';

import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton } from './Button.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { useDismissableLayer, useFocusTrap, useScrollLock } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';

interface OverlayBehaviourProps {
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnBackdropClick?: boolean;
  /** Close when Escape is pressed. Default `true`. */
  closeOnEscape?: boolean;
  /** Element to focus when opened. Defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Element to render into. Defaults to `document.body`. */
  container?: HTMLElement | null;
}

export interface ModalProps extends OverlayBehaviourProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Action row, typically Cancel + primary action buttons. */
  footer?: React.ReactNode;
  /** Max width: `sm` 400px, `md` 540px, `lg` 720px, `xl` 960px, `full` 92vw. Default `md`. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  /** Accessible name when there is no visible `title`. */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MODAL_WIDTHS = {
  sm: '400px',
  md: '540px',
  lg: '720px',
  xl: '960px',
  full: '92vw',
};

/**
 * A centred dialog that blocks the page. Traps focus while open, restores it
 * to the trigger on close, locks page scroll and closes on Escape/backdrop.
 *
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Delete bucket?"
 *   footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger">Delete</Button></>}>
 *   This permanently removes all objects.
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  initialFocusRef,
  container,
  'aria-label': ariaLabel,
  className = '',
  style,
}) => {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalProps = usePortalThemeProps(mergeClassNames('field-modal-wrapper', className), style);

  useScrollLock(isOpen);
  useFocusTrap(dialogRef, isOpen, { initialFocusRef });
  useDismissableLayer(isOpen, {
    refs: [dialogRef],
    onDismiss: onClose,
    escape: closeOnEscape,
    outsidePress: false,
  });

  const portalTarget = getPortalTarget(container);
  if (!isOpen || !portalTarget) return null;

  return createPortal(
    <div {...portalProps}>
      <div
        className="field-modal-backdrop"
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="field-modal-content"
        aria-label={!title ? ariaLabel ?? 'Dialog' : undefined}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        style={{ maxWidth: MODAL_WIDTHS[size] }}
      >
        {(title || showCloseButton) && (
          <div className="field-modal-header">
            <div className="field-modal-heading">
              {title && (
                <h2 id={`${id}-title`} className="field-modal-title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={`${id}-desc`} className="field-modal-description">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <IconButton icon={<X size={16} />} variant="ghost" size="sm" aria-label="Close dialog" onClick={onClose} />
            )}
          </div>
        )}
        <div className="field-modal-body">{children}</div>
        {footer && <div className="field-modal-footer">{footer}</div>}
      </div>
    </div>,
    portalTarget
  );
};

export interface DrawerProps extends OverlayBehaviourProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Edge the panel slides in from. Default `right`. */
  side?: 'left' | 'right';
  /** Panel width (any CSS length). Default `420px`. */
  width?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A panel that slides in from the edge of the screen for details, filters or
 * secondary forms. Same focus and dismissal behaviour as `Modal`.
 *
 * @example
 * <Drawer isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name}>…</Drawer>
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  width = '420px',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  initialFocusRef,
  container,
  'aria-label': ariaLabel,
  className = '',
  style,
}) => {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const portalProps = usePortalThemeProps(mergeClassNames('field-drawer-wrapper', className), style);

  useScrollLock(isOpen);
  useFocusTrap(panelRef, isOpen, { initialFocusRef });
  useDismissableLayer(isOpen, {
    refs: [panelRef],
    onDismiss: onClose,
    escape: closeOnEscape,
    outsidePress: false,
  });

  const portalTarget = getPortalTarget(container);
  if (!isOpen || !portalTarget) return null;

  return createPortal(
    <div {...portalProps}>
      <div
        className="field-drawer-backdrop"
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={mergeClassNames('field-drawer-panel', side === 'left' && 'field-drawer-left')}
        style={{ maxWidth: width }}
        aria-label={!title ? ariaLabel ?? 'Panel' : undefined}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
      >
        <div className="field-modal-header">
          <div className="field-modal-heading">
            {title && (
              <h2 id={`${id}-title`} className="field-modal-title">
                {title}
              </h2>
            )}
            {description && (
              <p id={`${id}-desc`} className="field-modal-description">
                {description}
              </p>
            )}
          </div>
          <IconButton icon={<X size={16} />} variant="ghost" size="sm" aria-label="Close panel" onClick={onClose} />
        </div>
        <div className="field-drawer-body">{children}</div>
        {footer && <div className="field-modal-footer">{footer}</div>}
      </div>
    </div>,
    portalTarget
  );
};
