'use client';

import React, { forwardRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from './Primitives.js';
import { mergeClassNames, useResolvedTag } from '../utils/polymorphic.js';
import { applyResponsive, createResponsiveAccumulator, type Responsive } from '../utils/responsive.js';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const resolveCardPadding = (p: CardPadding) => {
  if (p === 'none') return '0';
  if (p === 'sm') return 'var(--field-space-3)';
  if (p === 'lg') return 'var(--field-space-6)';
  return 'var(--field-space-5)';
};

export interface CardBaseProps {
  /** `interactive` adds hover elevation for clickable cards; `inset` gives a sunken background. Defaults to `interactive` when `href` is set or the card renders a `<button>`. */
  variant?: 'default' | 'interactive' | 'inset';
  /** Inner padding. `none` is useful for media or tables that run edge to edge. Default `md`. Accepts a breakpoint object. */
  padding?: Responsive<CardPadding>;
  /** Stretch to 100% height of its grid cell or flex container, with CardFooter pinned to the bottom. Works with `href` and `as="button"`. */
  fill?: boolean;
  /**
   * Makes the whole card a link (renders an `<a>`, or router link; always a plain `<a>` with
   * `download` or a `target` other than `_self`). Do not nest other links or buttons inside.
   */
  href?: string;
  /** Link target, used with `href`. */
  target?: string;
  /** Link rel, used with `href`. */
  rel?: string;
  /**
   * Element or component to render, e.g. `as="article"`, a router link with `href`, or `as="button"` for a
   * selectable card (it gets `type="button"` and loses the browser's button styles).
   */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Element attributes for every element a card can render: a `<div>` / `<article>`, an `<a>` (with `href`)
 * or a `<button>` (`as="button"`), so `type`, `disabled`, `aria-pressed` and `download` type-check.
 */
export type CardProps = CardBaseProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof CardBaseProps> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CardBaseProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CardBaseProps>;

/**
 * A raised surface for grouping related content. Compose with `CardHeader`,
 * `CardContent` and `CardFooter`. Set `href` (and `as` for a router link) to make
 * the whole card a link, or `as="button"` to make it a button.
 *
 * @example
 * <Card fill>
 *   <CardHeader><Heading level={4}>Usage</Heading></CardHeader>
 *   <CardContent>…</CardContent>
 *   <CardFooter>…</CardFooter>
 * </Card>
 * <Card href="/pricing"><Heading level={3}>Pricing</Heading></Card>
 * <Card as="button" aria-pressed={selected} onClick={select}>Album</Card>
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant, padding = 'md', fill = false, href, as, type, children, className = '', style, ...props }, ref) => {
    const Tag: React.ElementType = useResolvedTag(as, href, 'div', props);
    const isButton = Tag === 'button';
    const resolvedVariant = variant ?? (href || isButton ? 'interactive' : 'default');

    const acc = createResponsiveAccumulator();
    const isStringPadding = typeof padding === 'string';
    if (!isStringPadding && padding) {
      applyResponsive(acc, 'p', 'padding', padding, resolveCardPadding, 'md');
    }

    return (
      <Tag
        ref={ref}
        href={href}
        type={isButton ? type ?? 'button' : type}
        className={mergeClassNames(
          'field-card',
          resolvedVariant === 'interactive' && 'field-card-interactive',
          resolvedVariant === 'inset' && 'field-card-inset',
          href && 'field-card-link',
          isButton && 'field-card-button',
          fill && 'field-card-fill',
          isStringPadding && padding !== 'md' && `field-card-padding-${padding}`,
          ...acc.classes,
          className
        )}
        style={{ ...acc.style, ...style }}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = 'Card';

/** Top section of a card, typically a heading and actions. */
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={mergeClassNames('field-card-header', className)} {...props}>
    {children}
  </div>
);

/** Main content of a card. */
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={mergeClassNames('field-card-content', className)} {...props}>
    {children}
  </div>
);

/** Bottom section of a card, separated by a border. */
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={mergeClassNames('field-card-footer', className)} {...props}>
    {children}
  </div>
);

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label: React.ReactNode;
  value?: React.ReactNode;
  /** Change indicator. `up` is green and `down` red unless `invertTrendColors` is set. */
  delta?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  /** Treat "down" as good (e.g. latency, cost). */
  invertTrendColors?: boolean;
  icon?: React.ReactNode;
  /** Small supporting text under the value. */
  subtitle?: React.ReactNode;
  /** Visual under the value, e.g. a `<Sparkline>`. */
  chart?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * A KPI tile: label, large value, optional trend delta and sparkline.
 *
 * @example
 * <StatCard label="Monthly spend" value="$12,480" delta={{ value: '4.2%', trend: 'up' }}
 *   chart={<Sparkline data={spend} />} />
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value = '',
  delta,
  invertTrendColors = false,
  icon,
  subtitle,
  chart,
  className = '',
  isLoading = false,
  ...props
}) => {
  return (
    <div className={mergeClassNames('field-stat-card', className)} aria-busy={isLoading || undefined} {...props}>
      <div className="field-stat-card-header">
        <span className="field-stat-label">{label}</span>
        {icon && <span className="field-stat-card-icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="field-stat-card-body">
        {isLoading ? (
          <div className="field-stat-card-loading">
            <Skeleton width="60%" height="28px" />
            <Skeleton width="40%" height="16px" />
          </div>
        ) : (
          <>
            <span className="field-stat-value">{value}</span>
            {delta && (
              <span
                className={mergeClassNames(
                  'field-stat-card-delta',
                  `trend-${delta.trend}`,
                  invertTrendColors && 'inverted'
                )}
              >
                {delta.trend === 'up' && <ArrowUpRight size={14} aria-hidden="true" />}
                {delta.trend === 'down' && <ArrowDownRight size={14} aria-hidden="true" />}
                <span className="field-sr-only">{delta.trend === 'up' ? 'Up ' : delta.trend === 'down' ? 'Down ' : ''}</span>
                {delta.value}
              </span>
            )}
          </>
        )}
      </div>
      {subtitle && <p className="field-stat-card-subtitle">{subtitle}</p>}
      {chart && <div className="field-stat-card-chart">{chart}</div>}
    </div>
  );
};
