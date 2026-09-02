import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
    }
    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    updateCoords();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleScrollOrResize = () => {
      updateCoords();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible]);

  const getTransform = () => {
    switch (position) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0, -50%)';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        style={{ display: 'inline-flex' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`field-tooltip ${className}`}
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: getTransform(),
              zIndex: 99999,
              pointerEvents: 'none',
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};
