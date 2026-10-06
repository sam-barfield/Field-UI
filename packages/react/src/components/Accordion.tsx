'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { useControllableState, useIsomorphicLayoutEffect } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- ACCORDION --- */
export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Controlled list of open item ids. */
  openIds?: string[];
  /** Initially open items when uncontrolled. */
  defaultOpenIds?: string[];
  onOpenChange?: (openIds: string[]) => void;
  /** Allow several items open at once. Default `false`. */
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Vertically stacked, collapsible sections. Each header is a button wired to
 * its region with `aria-expanded` / `aria-controls`.
 *
 * @example
 * <Accordion allowMultiple items={[{ id: 'billing', title: 'Billing', content: <BillingFaq /> }]} />
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  openIds: controlledOpenIds,
  defaultOpenIds = [],
  onOpenChange,
  allowMultiple = false,
  className = '',
}) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useControllableState<string[]>({
    value: controlledOpenIds,
    defaultValue: defaultOpenIds,
    onChange: onOpenChange,
  });

  const toggle = (id: string) => {
    if (openIds.includes(id)) setOpenIds(openIds.filter(item => item !== id));
    else setOpenIds(allowMultiple ? [...openIds, id] : [id]);
  };

  return (
    <div className={mergeClassNames('field-accordion', className)}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div key={item.id} className={mergeClassNames('field-accordion-item', isOpen && 'open')}>
            <h3 className="field-accordion-heading">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                className="field-accordion-trigger"
              >
                <span className="field-accordion-title">{item.title}</span>
                <ChevronDown size={16} className="field-accordion-chevron" aria-hidden="true" />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={headerId} className="field-accordion-content">
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
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  /** The element that triggers the tooltip on hover and focus. */
  children: React.ReactElement;
  /** Preferred side; flips when there is no room. Default `top`. */
  position?: TooltipPosition;
  /** Hover delay before showing, in ms. Default `200`. */
  delay?: number;
  /** Disable the tooltip without unmounting the trigger. */
  disabled?: boolean;
  container?: HTMLElement | null;
  className?: string;
}

const OPPOSITE: Record<TooltipPosition, TooltipPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/**
 * A short text label shown on hover or keyboard focus. The trigger is linked
 * with `aria-describedby`, and Escape dismisses it.
 *
 * @example
 * <Tooltip content="Copy to clipboard"><IconButton icon={<Copy />} aria-label="Copy" /></Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  container,
  className = '',
}) => {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [placement, setPlacement] = useState<{ top: number; left: number; side: TooltipPosition } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const portalProps = usePortalThemeProps(mergeClassNames('field-tooltip', className));

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const tip = tooltipRef.current;
    const tipWidth = tip?.offsetWidth ?? 0;
    const tipHeight = tip?.offsetHeight ?? 0;
    const gap = 8;
    const margin = 6;

    const fits = (side: TooltipPosition) => {
      if (side === 'top') return rect.top - gap - tipHeight >= margin;
      if (side === 'bottom') return rect.bottom + gap + tipHeight <= window.innerHeight - margin;
      if (side === 'left') return rect.left - gap - tipWidth >= margin;
      return rect.right + gap + tipWidth <= window.innerWidth - margin;
    };
    const side = fits(position) || !fits(OPPOSITE[position]) ? position : OPPOSITE[position];

    let top: number;
    let left: number;
    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? rect.top - gap - tipHeight : rect.bottom + gap;
      left = rect.left + rect.width / 2 - tipWidth / 2;
    } else {
      top = rect.top + rect.height / 2 - tipHeight / 2;
      left = side === 'left' ? rect.left - gap - tipWidth : rect.right + gap;
    }
    left = Math.max(margin, Math.min(left, window.innerWidth - tipWidth - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - tipHeight - margin));
    setPlacement({ top, left, side });
  }, [position]);

  const show = (immediate = false) => {
    if (disabled) return;
    clearTimeout(timerRef.current);
    if (immediate || delay <= 0) setIsVisible(true);
    else timerRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
    setPlacement(null);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useIsomorphicLayoutEffect(() => {
    if (isVisible) updatePosition();
  }, [isVisible, updatePosition, content]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, updatePosition]);

  const portalTarget = getPortalTarget(container);
  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        'aria-describedby': isVisible
          ? mergeClassNames((children.props as any)['aria-describedby'], tooltipId)
          : (children.props as any)['aria-describedby'],
      })
    : children;

  return (
    <>
      <span
        ref={triggerRef}
        className="field-tooltip-trigger"
        onMouseEnter={() => show()}
        onMouseLeave={hide}
        onFocus={() => show(true)}
        onBlur={hide}
      >
        {trigger}
      </span>
      {isVisible &&
        !disabled &&
        portalTarget &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            {...portalProps}
            data-side={placement?.side ?? position}
            style={{
              ...portalProps.style,
              position: 'fixed',
              top: placement?.top ?? 0,
              left: placement?.left ?? 0,
              visibility: placement ? 'visible' : 'hidden',
            }}
          >
            {content}
          </div>,
          portalTarget
        )}
    </>
  );
};
