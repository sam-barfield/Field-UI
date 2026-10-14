'use client';

import React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { mergeClassNames, renderPolymorphic, resolveTag } from '../utils/polymorphic.js';
import { useLinkComponent } from '../theme/ThemeProvider.js';

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

type SkeletonRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

const resolveSkeletonRadius = (r?: SkeletonRadius | string) => {
  if (!r) return undefined;
  if (['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(r)) {
    return `var(--field-radius-${r})`;
  }
  return r;
};

/* --- SKELETON --- */
export interface SkeletonProps {
  /** Width (number = px). */
  width?: string | number;
  /** Height (number = px). */
  height?: string | number;
  /** Aspect ratio, e.g. `16 / 9`, `1`, or `"4/3"`. When provided, height defaults to `auto`. */
  ratio?: number | string;
  /** Corner radius: a token name (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `full`) or any CSS length. Default `sm`. */
  radius?: SkeletonRadius | string;
  /** @deprecated Use `radius`. */
  borderRadius?: SkeletonRadius | string;
  /** Render a circle (`width` is used for both dimensions). */
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A shimmering placeholder shown while content loads. Hidden from assistive tech. */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  ratio,
  radius,
  borderRadius,
  circle = false,
  className = '',
  style,
}) => {
  const effectiveRadius = resolveSkeletonRadius(radius ?? borderRadius ?? 'sm');
  const resolvedHeight = height ?? (ratio !== undefined ? 'auto' : '20px');
  const aspectRatio = typeof ratio === 'number' ? String(ratio) : ratio;

  return (
    <div
      aria-hidden="true"
      className={mergeClassNames('field-skeleton', className)}
      style={{
        width,
        height: circle ? width : resolvedHeight,
        aspectRatio,
        borderRadius: circle ? 'var(--field-radius-full)' : effectiveRadius,
        ...style,
      }}
    />
  );
};

Skeleton.displayName = 'Skeleton';

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
  const linkComponent = useLinkComponent();

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

            // A link when there is an href or a custom component (e.g. `as: Link` + `linkProps: { to }`).
            if (isInteractive && (item.href || item.as)) {
              return renderPolymorphic(resolveTag(linkComponent, item.as, item.href, 'a', item.linkProps), {
                className: 'field-breadcrumb-link',
                href: item.href,
                onClick: item.onClick,
                ...item.linkProps,
                children: item.label,
              });
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

          // Crumbs are positional, and two can share an href (e.g. "#"), so key by position.
          return (
            <li key={idx} className="field-breadcrumb-item">
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

Breadcrumb.displayName = 'Breadcrumb';

/* --- VISUALLY HIDDEN (F20, F22) --- */
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /**
   * Only visually hide on screens narrower than this breakpoint.
   * On wider screens, the element renders visibly.
   */
  below?: 'sm' | 'md' | 'lg' | 'xl';
  /** Element to render. Default `span`. */
  as?: React.ElementType;
  className?: string;
}

/**
 * Hides content visually while keeping it fully accessible to screen readers.
 * Use `below` (e.g. `below="sm"`) to hide labels on small mobile screens only.
 *
 * @example
 * <VisuallyHidden>Current page</VisuallyHidden>
 * <VisuallyHidden below="sm">Basket ({count})</VisuallyHidden>
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  below,
  as: Component = 'span',
  className = '',
  style,
  ...props
}) => {
  const classNames = mergeClassNames(
    below ? `field-visually-hidden-below-${below}` : 'field-sr-only',
    className
  );

  return (
    <Component className={classNames} style={style} {...props}>
      {children}
    </Component>
  );
};

VisuallyHidden.displayName = 'VisuallyHidden';
