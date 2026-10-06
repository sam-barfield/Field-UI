'use client';

import React, { useRef, useEffect, createContext, useContext, useCallback, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import {
  getFocusableElements,
  handleListKeyNavigation,
  useAnchoredPosition,
  useControllableState,
  useDismissableLayer,
} from '../utils/hooks.js';
import { composeEventHandlers, getInteractiveElementProps, mergeClassNames, renderPolymorphic } from '../utils/polymorphic.js';

interface DropdownContextValue {
  close: (returnFocus?: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const ITEM_SELECTOR = '[role="menuitem"]';

export interface DropdownMenuProps {
  /** Element that opens the menu. A plain node is wrapped in an unstyled button. */
  trigger: React.ReactNode;
  /** `DropdownItem`, `DropdownGroup`, `DropdownLabel` and `DropdownDivider` elements. */
  children: React.ReactNode;
  /** Align the menu with the trigger's start or end edge. Default `start`. */
  align?: 'start' | 'end';
  /** Controlled open state. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Minimum menu width (any CSS length). */
  minWidth?: string;
  'aria-label'?: string;
  container?: HTMLElement | null;
  className?: string;
}

/**
 * A menu of actions opened from a button. Arrow keys / Home / End move
 * through items, Enter activates, Escape closes and returns focus.
 *
 * @example
 * <DropdownMenu trigger={<IconButton icon={<MoreHorizontal />} aria-label="Actions" />} align="end">
 *   <DropdownItem icon={<Pencil size={14} />} onSelect={rename}>Rename</DropdownItem>
 *   <DropdownDivider />
 *   <DropdownItem variant="danger" onSelect={remove}>Delete</DropdownItem>
 * </DropdownMenu>
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'start',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  minWidth,
  'aria-label': ariaLabel,
  container,
  className = '',
}) => {
  const menuId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllableState({ value: controlledIsOpen, defaultValue: defaultOpen, onChange: onOpenChange });
  const portalProps = usePortalThemeProps(mergeClassNames('field-dropdown-menu', className));
  const { style: floatingStyle } = useAnchoredPosition(anchorRef, menuRef, open, { align, offset: 6 });

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus && anchorRef.current) getFocusableElements(anchorRef.current)[0]?.focus();
    },
    [setOpen]
  );

  useDismissableLayer(open, { refs: [anchorRef, menuRef], onDismiss: () => close(true) });

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:not([disabled]):not([aria-disabled="true"])`);
    if (first) first.focus({ preventScroll: true });
    else menuRef.current?.focus({ preventScroll: true });
  }, [open]);

  const contextValue = useMemo(() => ({ close }), [close]);

  const triggerProps = {
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  const renderedTrigger = React.isValidElement(trigger) ? (
    React.cloneElement(trigger as React.ReactElement<any>, {
      ...triggerProps,
      onKeyDown: composeEventHandlers((trigger as React.ReactElement<any>).props?.onKeyDown, triggerProps.onKeyDown),
      onClick: composeEventHandlers((trigger as React.ReactElement<any>).props?.onClick, () => setOpen(!open)),
    })
  ) : (
    <button type="button" className="field-unstyled-button" onClick={() => setOpen(!open)} {...triggerProps}>
      {trigger}
    </button>
  );

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (handleListKeyNavigation(e, menuRef.current, ITEM_SELECTOR, 'vertical')) return;
    if (e.key === 'Tab') {
      close(false);
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Type-ahead: jump to the next item starting with the typed character.
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
      const start = items.indexOf(document.activeElement as HTMLElement) + 1;
      const ordered = [...items.slice(start), ...items.slice(0, start)];
      ordered.find(el => el.textContent?.trim().toLowerCase().startsWith(e.key.toLowerCase()))?.focus();
    }
  };

  const portalTarget = getPortalTarget(container);

  return (
    <DropdownContext.Provider value={contextValue}>
      <span ref={anchorRef} className="field-dropdown-wrapper">
        {renderedTrigger}
      </span>
      {open &&
        portalTarget &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-label={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            {...portalProps}
            style={{ ...portalProps.style, ...floatingStyle, minWidth }}
          >
            {children}
          </div>,
          portalTarget
        )}
    </DropdownContext.Provider>
  );
};

export interface DropdownGroupProps {
  label?: React.ReactNode;
  children: React.ReactNode;
}

/** Groups related items under an optional label. */
export const DropdownGroup: React.FC<DropdownGroupProps> = ({ label, children }) => {
  const labelId = useId();
  return (
    <div className="field-dropdown-group" role="group" aria-labelledby={label ? labelId : undefined}>
      {label && (
        <div id={labelId} className="field-dropdown-label">
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

export interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** Called when the item is activated (click or Enter). The menu closes afterwards. */
  onSelect?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  /** Keyboard shortcut hint shown on the right, e.g. `⌘D`. */
  shortcut?: string;
  className?: string;
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/** A single menu action. Renders a link when `href` is set. */
export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  onSelect,
  variant = 'default',
  disabled = false,
  shortcut,
  className = '',
  asChild = false,
  as,
  href,
  onClick,
}) => {
  const ctx = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    onSelect?.();
    ctx?.close(true);
  };

  const itemClass = mergeClassNames('field-dropdown-item', variant === 'danger' && 'variant-danger', className);
  const renderInner = (content: React.ReactNode) => (
    <>
      {icon && <span className="field-dropdown-item-icon" aria-hidden="true">{icon}</span>}
      <span className="field-dropdown-item-label">{content}</span>
      {shortcut && <span className="field-dropdown-item-shortcut">{shortcut}</span>}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return renderPolymorphic('button', {
      asChild: true,
      className: itemClass,
      role: 'menuitem',
      tabIndex: -1,
      'aria-disabled': disabled || undefined,
      onClick: handleClick,
      children: React.cloneElement(child, { children: renderInner(child.props.children) }),
    });
  }

  const tag: React.ElementType = as ?? (href ? 'a' : 'button');
  return renderPolymorphic(tag, {
    role: 'menuitem',
    tabIndex: -1,
    className: itemClass,
    ...getInteractiveElementProps(tag, { href, disabled }),
    onClick: handleClick,
    children: renderInner(children),
  });
};

/** A horizontal rule between groups of items. */
export const DropdownDivider: React.FC = () => <div role="separator" className="field-dropdown-divider" />;

/** A non-interactive heading inside the menu. */
export const DropdownLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="field-dropdown-label">{children}</div>
);
