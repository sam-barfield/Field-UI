import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'start',
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(val);
    }
    onOpenChange?.(val);
  };

  const close = () => setOpen(false);

  // Click outside and escape handling
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ close }}>
      <div ref={containerRef} className={`field-dropdown-wrapper ${className}`}>
        <div
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
          aria-expanded={open}
          style={{ display: 'inline-flex' }}
        >
          {trigger}
        </div>

        {open && (
          <div
            className={`field-dropdown-menu align-${align}`}
            role="menu"
            tabIndex={-1}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

export interface DropdownGroupProps {
  label?: string;
  children: React.ReactNode;
}

export const DropdownGroup: React.FC<DropdownGroupProps> = ({ label, children }) => (
  <div className="field-dropdown-group" role="group">
    {label && <div className="field-dropdown-label">{label}</div>}
    {children}
  </div>
);

export interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  shortcut?: string;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  onSelect,
  variant = 'default',
  disabled = false,
  shortcut,
  className = '',
}) => {
  const ctx = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onSelect?.();
    ctx?.close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={`field-dropdown-item ${variant === 'danger' ? 'variant-danger' : ''} ${className}`}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span style={{ flex: 1, textAlign: 'left' }}>{children}</span>
      {shortcut && (
        <span style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)', marginLeft: '8px' }}>
          {shortcut}
        </span>
      )}
    </button>
  );
};

export const DropdownDivider: React.FC = () => <div className="field-dropdown-divider" role="separator" />;

export const DropdownLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="field-dropdown-label">{children}</div>
);
