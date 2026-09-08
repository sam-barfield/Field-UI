import React, { useState, useRef, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { renderPolymorphic } from '../utils/polymorphic';

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

  const setOpen = useCallback((val: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(val);
    }
    onOpenChange?.(val);
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => setOpen(false), [setOpen]);

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
  }, [open, close]);

  const contextValue = useMemo(() => ({ close }), [close]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <div ref={containerRef} className={`field-dropdown-wrapper ${className}`}>
        {React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              (trigger as React.ReactElement<any>).props?.onClick?.(e);
              setOpen(!open);
            },
            'aria-haspopup': 'menu',
            'aria-expanded': open,
          })
        ) : (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-haspopup="menu"
            aria-expanded={open}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              color: 'inherit',
              cursor: 'pointer',
              display: 'inline-flex',
            }}
          >
            {trigger}
          </button>
        )}

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
  <div className="field-dropdown-group">
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
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

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
    ctx?.close();
  };

  const itemClass = `field-dropdown-item ${variant === 'danger' ? 'variant-danger' : ''} ${className}`;

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const innerContent = (icon || shortcut) ? (
      <>
        {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        <span style={{ flex: 1, textAlign: 'left' }}>{child.props.children}</span>
        {shortcut && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)', marginLeft: '8px' }}>
            {shortcut}
          </span>
        )}
      </>
    ) : child.props.children;

    return renderPolymorphic(
      'button',
      {
        asChild: true,
        className: itemClass,
        role: 'menuitem',
        'aria-disabled': disabled || undefined,
        onClick: handleClick,
        children: React.cloneElement(child, { children: innerContent }),
      }
    );
  }

  const defaultTag = href ? 'a' : 'button';
  const elementProps: Record<string, any> = {
    as,
    role: 'menuitem',
    className: itemClass,
    onClick: handleClick,
    children: (
      <>
        {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
        <span style={{ flex: 1, textAlign: 'left' }}>{children}</span>
        {shortcut && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)', marginLeft: '8px' }}>
            {shortcut}
          </span>
        )}
      </>
    ),
  };

  if (href && !as) {
    elementProps.href = disabled ? undefined : href;
    elementProps['aria-disabled'] = disabled || undefined;
  } else if (!as || as === 'button') {
    elementProps.type = 'button';
    elementProps.disabled = disabled;
  }

  return renderPolymorphic(defaultTag, elementProps);
};

export const DropdownDivider: React.FC = () => <hr className="field-dropdown-divider" />;

export const DropdownLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="field-dropdown-label">{children}</div>
);
