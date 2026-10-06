'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { handleListKeyNavigation, useDismissableLayer, useIsomorphicLayoutEffect } from '../utils/hooks.js';
import { getInteractiveElementProps, mergeClassNames, renderPolymorphic } from '../utils/polymorphic.js';

export interface ContextMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  /** Render a separator instead of an item. */
  divider?: boolean;
  /** Keyboard shortcut hint. */
  shortcut?: string;
  href?: string;
  asChild?: boolean;
  as?: React.ElementType;
}

export interface ContextMenuProps {
  /** The area that opens the menu on right-click (or Shift+F10 / the Menu key when focused). */
  children: React.ReactNode;
  items: ContextMenuItem[];
  container?: HTMLElement | null;
  className?: string;
}

const ITEM_SELECTOR = '[role="menuitem"]';

/**
 * A right-click menu for the wrapped content. Also opens from the keyboard
 * with Shift+F10 or the Menu key, and supports arrow-key navigation.
 *
 * @example
 * <ContextMenu items={[{ id: 'copy', label: 'Copy ARN', onSelect: copy }]}>
 *   <TableRow>…</TableRow>
 * </ContextMenu>
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, container, className = '' }) => {
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const portalProps = usePortalThemeProps(mergeClassNames('field-context-menu', className));
  const isOpen = anchor !== null;

  const openAt = (x: number, y: number) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setPosition(null);
    setAnchor({ x, y });
  };

  const close = (returnFocus = true) => {
    setAnchor(null);
    if (returnFocus) returnFocusRef.current?.focus?.();
  };

  useDismissableLayer(isOpen, { refs: [menuRef], onDismiss: () => close(true) });

  // Measure the rendered menu and keep it inside the viewport.
  useIsomorphicLayoutEffect(() => {
    if (!anchor || !menuRef.current) return;
    const { offsetWidth, offsetHeight } = menuRef.current;
    const margin = 8;
    setPosition({
      left: Math.max(margin, Math.min(anchor.x, window.innerWidth - offsetWidth - margin)),
      top: Math.max(margin, Math.min(anchor.y, window.innerHeight - offsetHeight - margin)),
    });
  }, [anchor]);

  useEffect(() => {
    if (!isOpen || !position) return;
    menuRef.current
      ?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:not([disabled]):not([aria-disabled="true"])`)
      ?.focus({ preventScroll: true });
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => close(false);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      openAt(rect.left + 8, rect.bottom);
    }
  };

  const portalTarget = getPortalTarget(container);

  return (
    <>
      <div onContextMenu={handleContextMenu} onKeyDown={handleTriggerKeyDown} className="field-context-menu-trigger">
        {children}
      </div>

      {isOpen &&
        portalTarget &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            {...portalProps}
            style={{
              ...portalProps.style,
              left: position?.left ?? anchor.x,
              top: position?.top ?? anchor.y,
              visibility: position ? 'visible' : 'hidden',
            }}
            onKeyDown={e => {
              if (handleListKeyNavigation(e, menuRef.current, ITEM_SELECTOR)) return;
              if (e.key === 'Tab') close(false);
            }}
          >
            {items.map((item, idx) => {
              if (item.divider) {
                return <div role="separator" key={item.id ?? `div-${idx}`} className="field-dropdown-divider" />;
              }

              const itemClass = mergeClassNames('field-dropdown-item', item.variant === 'danger' && 'variant-danger');
              const handleClick = (e: React.MouseEvent) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                item.onSelect?.();
                close(true);
              };

              if (item.asChild && React.isValidElement(item.label)) {
                return (
                  <React.Fragment key={item.id}>
                    {renderPolymorphic('button', {
                      asChild: true,
                      role: 'menuitem',
                      tabIndex: -1,
                      'aria-disabled': item.disabled || undefined,
                      className: itemClass,
                      onClick: handleClick,
                      children: item.label,
                    })}
                  </React.Fragment>
                );
              }

              const tag: React.ElementType = item.as ?? (item.href ? 'a' : 'button');
              return (
                <React.Fragment key={item.id}>
                  {renderPolymorphic(tag, {
                    role: 'menuitem',
                    tabIndex: -1,
                    ...getInteractiveElementProps(tag, { href: item.href, disabled: item.disabled }),
                    className: itemClass,
                    onClick: handleClick,
                    children: (
                      <>
                        {item.icon && <span className="field-dropdown-item-icon" aria-hidden="true">{item.icon}</span>}
                        <span className="field-dropdown-item-label">{item.label}</span>
                        {item.shortcut && <span className="field-dropdown-item-shortcut">{item.shortcut}</span>}
                      </>
                    ),
                  })}
                </React.Fragment>
              );
            })}
          </div>,
          portalTarget
        )}
    </>
  );
};
