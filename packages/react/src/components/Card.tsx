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
  chart?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  icon,
  subtitle,
  chart,
  className = '',
}) => {
  return (
    <div className={`field-stat-card ${className}`}>
      <div className="field-stat-card-header">
        <span className="field-stat-label">{label}</span>
        {icon && <span className="field-stat-card-icon">{icon}</span>}
      </div>
      <div className="field-stat-card-body">
        <span className="field-stat-value">{value}</span>
        {delta && (
          <span className={`field-stat-card-delta trend-${delta.trend}`}>
            {delta.trend === 'up' && <ArrowUpRight size={14} />}
            {delta.trend === 'down' && <ArrowDownRight size={14} />}
            {delta.value}
          </span>
        )}
      </div>
      {subtitle && <p className="field-stat-card-subtitle">{subtitle}</p>}
      {chart && <div className="field-stat-card-chart">{chart}</div>}
    </div>
  );
};
