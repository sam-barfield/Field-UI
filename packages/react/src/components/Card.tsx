'use client';

import React, { forwardRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from './Primitives.js';
import { mergeClassNames } from '../utils/polymorphic.js';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `interactive` adds hover elevation for clickable cards. */
  variant?: 'default' | 'interactive';
  /** Inner padding. `none` is useful for media or tables that run edge to edge. Default `md`. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * A raised surface for grouping related content. Compose with `CardHeader`,
 * `CardContent` and `CardFooter`.
 *
 * @example
 * <Card>
 *   <CardHeader><Heading level={4}>Usage</Heading></CardHeader>
 *   <CardContent>…</CardContent>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          'field-card',
          variant === 'interactive' && 'field-card-interactive',
          padding !== 'md' && `field-card-padding-${padding}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
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
