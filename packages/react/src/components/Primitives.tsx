import React from 'react';
import { Loader2, ChevronRight } from 'lucide-react';

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
      <div
        className="field-progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
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
  label: string;
  href?: string;
  onClick?: () => void;
  isCurrent?: boolean;
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
          const isInteractive = Boolean(item.href || item.onClick) && !isCurrent;
          return (
            <li key={idx} className="field-breadcrumb-item">
              {isInteractive ? (
                <a
                  href={item.href || '#'}
                  onClick={e => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="field-breadcrumb-link"
                  role={!item.href ? 'button' : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <span className={isCurrent ? 'field-breadcrumb-current' : 'field-breadcrumb-static'}>
                  {item.label}
                </span>
              )}
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
