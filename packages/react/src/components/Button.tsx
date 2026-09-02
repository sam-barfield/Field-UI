import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'field-btn',
      `field-btn-${variant}`,
      `field-btn-${size}`,
      isFullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const computedStyle: React.CSSProperties = {
      ...(isFullWidth ? { width: '100%' } : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        style={computedStyle}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="field-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        {!isLoading && leftIcon && <span className="field-btn-icon-left">{leftIcon}</span>}
        <span className="field-btn-label">{children}</span>
        {!isLoading && rightIcon && <span className="field-btn-icon-right">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'field-btn',
      'field-icon-btn',
      `field-btn-${variant}`,
      `field-btn-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="field-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`field-btn-group ${className}`} role="group" {...props}>
      {children}
    </div>
  );
};

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div className={`field-segmented-control ${className}`} role="tablist">
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`field-segmented-item ${isActive ? 'active' : ''}`}
            style={{ fontSize: size === 'sm' ? '0.75rem' : '0.8125rem' }}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
