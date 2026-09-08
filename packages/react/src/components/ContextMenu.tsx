import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useThemeSafe } from '../theme';
import { renderPolymorphic } from '../utils/polymorphic';

export interface ContextMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  divider?: boolean;
  href?: string;
  asChild?: boolean;
  as?: React.ElementType;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  items: ContextMenuItem[];
  container?: HTMLElement | null;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  container,
  className = '',
}) => {
  const { theme } = useThemeSafe();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 200);
    const y = Math.min(e.clientY, (typeof window !== 'undefined' ? window.innerHeight : 1000) - (items.length * 36));
    setCoords({ x, y });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const portalTarget = container || (typeof document !== 'undefined' ? document.body : null);

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className} style={{ display: 'contents' }}>
        {children}
      </div>

      {isOpen &&
        portalTarget &&
        createPortal(
          <div
            ref={menuRef}
            className="field-context-menu field-scope"
            data-field-theme={theme.id}
            data-theme={theme.mode}
            style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
            role="menu"
          >
            {items.map((item, idx) => {
              if (item.divider) {
                return <hr key={item.id ?? `div-${idx}`} className="field-dropdown-divider" />;
              }

              const itemClass = `field-dropdown-item ${item.variant === 'danger' ? 'variant-danger' : ''}`;
              const handleClick = (e?: React.MouseEvent) => {
                if (!item.disabled) {
                  item.onSelect?.();
                  setIsOpen(false);
                }
              };

              if (item.asChild && React.isValidElement(item.label)) {
                return (
                  <React.Fragment key={item.id}>
                    {renderPolymorphic('button', {
                      asChild: true,
                      role: 'menuitem',
                      disabled: item.disabled,
                      className: itemClass,
                      onClick: handleClick,
                      children: item.label,
                    })}
                  </React.Fragment>
                );
              }

              const defaultTag = item.href && !item.disabled ? 'a' : 'button';
              return (
                <React.Fragment key={item.id}>
                  {renderPolymorphic(defaultTag, {
                    as: item.as,
                    role: 'menuitem',
                    href: item.disabled ? undefined : item.href,
                    type: !item.href && (!item.as || item.as === 'button') ? 'button' : undefined,
                    disabled: item.disabled,
                    className: itemClass,
                    onClick: handleClick,
                    children: (
                      <>
                        {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
                        <span>{item.label}</span>
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
