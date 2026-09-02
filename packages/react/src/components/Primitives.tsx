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
      <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 6px', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {item.href ? (
                <a
                  href={item.href}
                  onClick={e => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="field-text-sm"
                  style={{
                    color: item.isCurrent || isLast ? 'var(--field-text-primary)' : 'var(--field-text-secondary)',
                    textDecoration: 'none',
                    fontWeight: item.isCurrent || isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className="field-text-sm"
                  style={{
                    color: item.isCurrent || isLast ? 'var(--field-text-primary)' : 'var(--field-text-secondary)',
                    fontWeight: item.isCurrent || isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={14} style={{ color: 'var(--field-text-disabled)' }} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
