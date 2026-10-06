'use client';

import React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { mergeClassNames, renderPolymorphic } from '../utils/polymorphic.js';

/* --- PROGRESS --- */
export interface ProgressProps {
  /** Current value (0 to `max`). Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  label?: React.ReactNode;
  /** Show the percentage next to the label. */
  showValue?: boolean;
  /** Bar colour. Default `accent`. */
  variant?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

/**
 * A horizontal progress bar for determinate (`value`) or indeterminate work.
 *
 * @example
 * <Progress label="Uploading" value={42} showValue />
 */
export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'accent',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const labelId = React.useId();
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={mergeClassNames('field-progress', className)}>
      {(label || (showValue && !isIndeterminate)) && (
        <div className="field-progress-header">
          {label && (
            <span id={labelId} className="field-label">
              {label}
            </span>
          )}
          {showValue && !isIndeterminate && <span className="field-progress-value">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={mergeClassNames(
          'field-progress-track',
          size === 'sm' && 'field-progress-sm',
          isIndeterminate && 'indeterminate'
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? ariaLabel ?? 'Progress' : undefined}
      >
        <div
          className={mergeClassNames('field-progress-bar', variant !== 'accent' && `field-progress-${variant}`)}
          style={isIndeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* --- SPINNER --- */
export interface SpinnerProps {
  /** Diameter in px. Default 20. */
  size?: number;
  /** Text announced to screen readers. Default "Loading". */
  label?: string;
  className?: string;
}

/** An animated loading indicator, announced as "Loading" by screen readers. */
export const Spinner: React.FC<SpinnerProps> = ({ size = 20, label = 'Loading', className = '' }) => {
  return (
    <span role="status" className={mergeClassNames('field-spinner-wrapper', className)}>
      <Loader2 size={size} className="field-spinner" aria-hidden="true" />
      <span className="field-sr-only">{label}</span>
    </span>
  );
};

/* --- SKELETON --- */
export interface SkeletonProps {
  /** Width (number = px). */
  width?: string | number;
  /** Height (number = px). */
  height?: string | number;
  /** Corner radius (any CSS length or token). */
  borderRadius?: string;
  /** Render a circle (`width` is used for both dimensions). */
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A shimmering placeholder shown while content loads. Hidden from assistive tech. */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--field-radius-sm)',
  circle = false,
  className = '',
  style,
}) => {
  return (
    <div
      aria-hidden="true"
      className={mergeClassNames('field-skeleton', className)}
      style={{
        width,
        height: circle ? width : height,
        borderRadius: circle ? 'var(--field-radius-full)' : borderRadius,
        ...style,
      }}
    />
  );
};

/* --- DIVIDER --- */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

/** A thin rule separating content. Use `vertical` inside flex rows. */
export const Divider: React.FC<DividerProps> = ({ orientation = 'horizontal', className = '', style }) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={mergeClassNames('field-divider-vertical', className)}
        style={style}
      />
    );
  }
  return <hr className={mergeClassNames('field-divider', className)} style={style} />;
};

/* --- BREADCRUMB --- */
export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  /** Mark as the current page. Defaults to the last item. */
  isCurrent?: boolean;
  /** Render `label` (a link element such as a router `<Link>`) directly, with breadcrumb styling merged in. */
  asChild?: boolean;
  /** Render the link with a custom component, e.g. `as: Link`. */
  as?: React.ElementType;
  /** Extra props for the `as` component (e.g. `{ to: '/projects' }`). */
  linkProps?: Record<string, unknown>;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Custom separator. Defaults to a chevron. */
  separator?: React.ReactNode;
  className?: string;
}

/**
 * Shows the user's location in a hierarchy. The last item is marked
 * `aria-current="page"`.
 *
 * @example
 * <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Buckets', href: '/s3' }, { label: 'logs-prod' }]} />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="field-breadcrumb-list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isCurrent = item.isCurrent ?? isLast;
          const isInteractive = Boolean(item.href || item.onClick || item.as || item.asChild) && !isCurrent;

          const renderItemContent = () => {
            if (isCurrent) {
              return (
                <span className="field-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              );
            }

            if (item.asChild && React.isValidElement(item.label)) {
              return renderPolymorphic('a', {
                asChild: true,
                className: 'field-breadcrumb-link',
                onClick: item.onClick,
                children: item.label,
              });
            }

            if (item.as) {
              return renderPolymorphic(item.as, {
                className: 'field-breadcrumb-link',
                href: item.href,
                onClick: item.onClick,
                ...item.linkProps,
                children: item.label,
              });
            }

            if (isInteractive && item.href) {
              return (
                <a href={item.href} onClick={item.onClick} className="field-breadcrumb-link">
                  {item.label}
                </a>
              );
            }

            if (isInteractive) {
              return (
                <button type="button" onClick={item.onClick} className="field-breadcrumb-link field-breadcrumb-button">
                  {item.label}
                </button>
              );
            }

            return <span className="field-breadcrumb-static">{item.label}</span>;
          };

          const itemKey = item.href || (typeof item.label === 'string' ? item.label : `breadcrumb-${idx}`);

          return (
            <li key={itemKey} className="field-breadcrumb-item">
              {renderItemContent()}
              {!isLast && (
                <span className="field-breadcrumb-separator" aria-hidden="true">
                  {separator ?? <ChevronRight size={14} />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
