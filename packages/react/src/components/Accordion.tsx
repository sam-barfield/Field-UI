import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* --- ACCORDION --- */
export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const isOpen = prev.includes(id);
      if (isOpen) {
        return prev.filter(item => item !== id);
      } else {
        return allowMultiple ? [...prev, id] : [id];
      }
    });
  };

  return (
    <div className={`field-stack gap-2 ${className}`} style={{ gap: '8px' }}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--field-surface-raised)',
              border: '1px solid var(--field-border-subtle)',
              borderRadius: 'var(--field-radius-md)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--field-text-primary)',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={16}
                style={{
                  color: 'var(--field-text-secondary)',
                  transition: 'transform 0.2s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 16px 14px 16px',
                  color: 'var(--field-text-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  borderTop: '1px solid var(--field-border-subtle)',
                  paddingTop: '12px',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* --- TOOLTIP --- */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' };
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="field-tooltip" role="tooltip" style={getPositionStyles()}>
          {content}
        </div>
      )}
    </div>
  );
};
