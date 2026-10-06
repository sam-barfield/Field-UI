'use client';

import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { getFocusableElements, useAnchoredPosition, useControllableState, useDismissableLayer } from '../utils/hooks.js';
import { composeEventHandlers, mergeClassNames } from '../utils/polymorphic.js';

export interface PopoverProps {
  /** Element that toggles the popover. A plain node is wrapped in an unstyled button. */
  trigger: React.ReactNode;
  content: React.ReactNode;
  /** Horizontal alignment to the trigger. Default `start`. */
  align?: 'start' | 'center' | 'end';
  /** Preferred side; flips when there isn't room. Default `bottom`. */
  position?: 'bottom' | 'top';
  /** Panel width (any CSS length). Default `280px`. */
  width?: string;
  /** Controlled open state. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the panel. */
  'aria-label'?: string;
  container?: HTMLElement | null;
  className?: string;
}

/**
 * Floating panel anchored to a trigger, for rich content such as details,
 * filters or small forms. Closes on outside click and Escape, and returns
 * focus to the trigger.
 *
 * @example
 * <Popover trigger={<Button>Filters</Button>} content={<FilterForm />} />
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  align = 'start',
  position = 'bottom',
  width = '280px',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  'aria-label': ariaLabel,
  container,
  className = '',
}) => {
  const panelId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllableState({ value: controlledIsOpen, defaultValue: defaultOpen, onChange: onOpenChange });
  const portalProps = usePortalThemeProps(mergeClassNames('field-popover-card', className));
  const { style: floatingStyle } = useAnchoredPosition(triggerRef, panelRef, open, { placement: position, align, offset: 8 });

  const close = () => {
    setOpen(false);
    if (triggerRef.current) getFocusableElements(triggerRef.current)[0]?.focus();
  };

  useDismissableLayer(open, { refs: [triggerRef, panelRef], onDismiss: close });

  const triggerProps = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
  };

  const renderedTrigger = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement<any>, {
      ...triggerProps,
      onClick: composeEventHandlers((trigger as React.ReactElement<any>).props?.onClick, () => setOpen(!open)),
    })
  ) : (
    <button
      type="button"
      className="field-unstyled-button"
      onClick={() => setOpen(!open)}
      {...triggerProps}
    >
      {trigger}
    </button>
  );

  const portalTarget = getPortalTarget(container);

  return (
    <>
      <span ref={triggerRef} className="field-popover-anchor">
        {renderedTrigger}
      </span>
      {open &&
        portalTarget &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={ariaLabel}
            {...portalProps}
            style={{ ...portalProps.style, ...floatingStyle, width, maxWidth: 'calc(100vw - 16px)' }}
          >
            {content}
          </div>,
          portalTarget
        )}
    </>
  );
};
