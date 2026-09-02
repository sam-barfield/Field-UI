import React, { forwardRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`field-card ${variant === 'interactive' ? 'field-card-interactive' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`field-card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`field-card-footer ${className}`} {...props}>
    {children}
  </div>
);

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  icon,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`field-stat-card ${className}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="field-stat-label">{label}</span>
        {icon && <span style={{ color: 'var(--field-text-tertiary)' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
        <span className="field-stat-value">{value}</span>
        {delta && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              gap: '2px',
              color:
                delta.trend === 'up'
                  ? 'var(--field-status-success-text)'
                  : delta.trend === 'down'
                  ? 'var(--field-status-danger-text)'
                  : 'var(--field-text-secondary)',
            }}
          >
            {delta.trend === 'up' && <ArrowUpRight size={14} />}
            {delta.trend === 'down' && <ArrowDownRight size={14} />}
            {delta.value}
          </span>
        )}
      </div>
      {subtitle && <p className="field-text-xs field-text-tertiary" style={{ marginTop: '6px' }}>{subtitle}</p>}
    </div>
  );
};
