import React, { useState, useRef, useEffect } from 'react';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  position?: 'bottom' | 'top';
  width?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  align = 'start',
  position = 'bottom',
  width = '280px',
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [effectiveAlign, setEffectiveAlign] = useState<'start' | 'center' | 'end'>(align);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(val);
    }
    onOpenChange?.(val);
  };

  useEffect(() => {
    setEffectiveAlign(align);
  }, [align]);

  useEffect(() => {
    if (!open) return;

    // Edge/boundary detection: auto-flip to 'end' if opening start would overflow right boundary
    if (align === 'start' && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportLimit = window.innerWidth - 12;

      // Also check if inside a constrained scroll/layout container
      const parent = containerRef.current?.closest<HTMLElement>('main, [data-field-theme], .field-scope, [style*="overflow"]');
      const parentRect = parent?.getBoundingClientRect();
      const rightLimit = parentRect && parentRect.right < viewportLimit ? parentRect.right - 8 : viewportLimit;

      if (rect.right > rightLimit) {
        setEffectiveAlign('end');
      }
    }

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, align]);

  return (
    <div ref={containerRef} className={`field-popover-wrapper ${className}`}>
      <div onClick={() => setOpen(!open)} style={{ display: 'inline-flex' }}>
        {trigger}
      </div>

      {open && (
        <div
          ref={cardRef}
          className={`field-popover-card align-${effectiveAlign} position-${position}`}
          style={{ width, maxWidth: 'min(calc(100vw - 24px), 320px)' }}
          role="dialog"
        >
          {content}
        </div>
      )}
    </div>
  );
};
