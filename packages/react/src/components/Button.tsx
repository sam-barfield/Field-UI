import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { renderPolymorphic } from '../utils/polymorphic';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
}

const getSpinnerSize = (size: ButtonSize): number => {
  if (size === 'sm') return 14;
  if (size === 'lg') return 18;
  return 16;
};

const renderButtonLabel = (
  content: React.ReactNode,
  isLoading: boolean,
  size: ButtonSize,
  leftIcon?: React.ReactNode,
  rightIcon?: React.ReactNode
) => (
  <>
    {isLoading && <Loader2 className="field-spinner" size={getSpinnerSize(size)} />}
    {!isLoading && leftIcon && <span className="field-btn-icon-left">{leftIcon}</span>}
    <span className="field-btn-label">{content}</span>
    {!isLoading && rightIcon && <span className="field-btn-icon-right">{rightIcon}</span>}
  </>
);

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
      asChild = false,
      as,
      href,
      type = 'button',
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

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const innerContent = renderButtonLabel(child.props.children, isLoading, size, leftIcon, rightIcon);

      return renderPolymorphic(
        'button',
        {
          asChild: true,
          className: classNames,
          style: computedStyle,
          'aria-busy': isLoading || undefined,
          children: React.cloneElement(child, { children: innerContent }),
          ...props,
        },
        ref
      );
    }

    const defaultTag = href ? 'a' : 'button';
    const elementProps: Record<string, any> = {
      as,
      className: classNames,
      style: computedStyle,
      'aria-busy': isLoading || undefined,
      children: renderButtonLabel(children, isLoading, size, leftIcon, rightIcon),
      ...props,
    };

    if (href || as === 'a') {
      elementProps.href = disabled || isLoading ? undefined : href;
      elementProps['aria-disabled'] = disabled || isLoading || undefined;
    }
    if (!as || as === 'button') {
      elementProps.type = type;
      elementProps.disabled = disabled || isLoading;
    }

    return renderPolymorphic(defaultTag, elementProps, ref);
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
  'aria-label': string;
  asChild?: boolean;
  as?: React.ElementType;
  href?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      asChild = false,
      as,
      href,
      type = 'button',
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

    const innerContent = isLoading ? (
      <Loader2 className="field-spinner" size={getSpinnerSize(size)} />
    ) : (
      icon
    );

    if (asChild && React.isValidElement(props.children || icon)) {
      const target = (props.children || icon) as React.ReactElement<any>;
      return renderPolymorphic(
        'button',
        {
          asChild: true,
          className: classNames,
          'aria-label': ariaLabel,
          'aria-busy': isLoading || undefined,
          children: React.cloneElement(target, {
            children: innerContent,
          }),
          ...props,
        },
        ref
      );
    }

    const defaultTag = href ? 'a' : 'button';
    const elementProps: Record<string, any> = {
      as,
      className: classNames,
      'aria-label': ariaLabel,
      'aria-busy': isLoading || undefined,
      children: innerContent,
      ...props,
    };

    if (href || as === 'a') {
      elementProps.href = disabled || isLoading ? undefined : href;
      elementProps['aria-disabled'] = disabled || isLoading || undefined;
    }
    if (!as || as === 'button') {
      elementProps.type = type;
      elementProps.disabled = disabled || isLoading;
    }

    return renderPolymorphic(defaultTag, elementProps, ref);
  }
);

IconButton.displayName = 'IconButton';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  attached?: boolean;
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`field-btn-group ${className}`} {...props}>
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

export function SegmentedControl<T extends string = string>(props: Readonly<SegmentedControlProps<T>>) {
  const {
    options,
    value,
    onChange,
    className = '',
    size = 'md',
  } = props;
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
