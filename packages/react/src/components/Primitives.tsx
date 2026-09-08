import React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { renderPolymorphic } from '../utils/polymorphic';

/* --- PROGRESS --- */
export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`field-form-item ${className}`}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <span className="field-label">{label}</span>}
          {showValue && (
            <span className="field-text-xs field-text-secondary" style={{ fontFamily: 'var(--field-font-mono)' }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <progress
        value={value}
        max={max}
        aria-label={label}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      >
        {percentage}%
      </progress>
      <div className="field-progress-track">
        <div className="field-progress-bar" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

/* --- SPINNER --- */
export interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className = '' }) => {
  return <Loader2 size={size} className={`field-spinner ${className}`} style={{ color: 'var(--field-accent-primary)' }} />;
};

/* --- SKELETON --- */
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--field-radius-sm)',
  className = '',
}) => {
  return (
    <div
      className={`field-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

/* --- DIVIDER --- */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ orientation = 'horizontal', className = '' }) => {
  return (
    <hr
      className={`${orientation === 'vertical' ? 'field-divider-vertical' : 'field-divider'} ${className}`}
    />
  );
};

/* --- BREADCRUMB --- */
export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  isCurrent?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="field-breadcrumb-list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isCurrent = item.isCurrent || isLast;
          const isInteractive = Boolean(item.href || item.onClick || item.as || item.asChild) && !isCurrent;

          const renderItemContent = () => {
            if (item.asChild && React.isValidElement(item.label)) {
              return renderPolymorphic('a', {
                asChild: true,
                className: 'field-breadcrumb-link',
                href: item.href,
                onClick: item.onClick,
                children: item.label,
              });
            }

            if (item.as) {
              return renderPolymorphic(item.as, {
                className: 'field-breadcrumb-link',
                href: item.href,
                onClick: item.onClick,
                children: item.label,
              });
            }

            if (isInteractive) {
              return (
                <a
                  href={item.href || '#'}
                  onClick={e => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick(e);
                    }
                  }}
                  className="field-breadcrumb-link"
                  role={!item.href ? 'button' : undefined}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <span className={isCurrent ? 'field-breadcrumb-current' : 'field-breadcrumb-static'}>
                {item.label}
              </span>
            );
          };

          const itemKey = item.href || (typeof item.label === 'string' ? item.label : `breadcrumb-${idx}`);

          return (
            <li key={itemKey} className="field-breadcrumb-item">
              {renderItemContent()}
              {!isLast && (
                <span className="field-breadcrumb-separator">
                  <ChevronRight size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
