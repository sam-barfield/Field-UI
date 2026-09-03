import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  divider?: boolean;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  items: ContextMenuItem[];
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, className = '' }) => {
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

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className} style={{ display: 'contents' }}>
        {children}
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            className="field-context-menu"
            style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
            role="menu"
          >
            {items.map((item, idx) => {
              if (item.divider) {
                return <div key={`div-${idx}`} className="field-dropdown-divider" role="separator" />;
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className={`field-dropdown-item ${item.variant === 'danger' ? 'variant-danger' : ''}`}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onSelect?.();
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};
