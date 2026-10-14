'use client';

import React, { forwardRef, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { getInteractiveElementProps, mergeClassNames, renderPolymorphic, useResolvedTag } from '../utils/polymorphic.js';
import { handleListKeyNavigation } from '../utils/hooks.js';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonBaseProps {
  /** Visual style. Use one `primary` per view for the main action. Default `secondary`. */
  variant?: ButtonVariant;
  /** Height and padding. `sm` 30px, `md` 36px, `lg` 44px, `xl` 48px. Default `md`. */
  size?: ButtonSize;
  /** Shows a spinner, disables the button and sets `aria-busy`. */
  isLoading?: boolean;
  /** Icon rendered before the label (hidden while loading). */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label (hidden while loading). */
  rightIcon?: React.ReactNode;
  /** Stretch to the width of the container. */
  isFullWidth?: boolean;
  /** Merge button styling onto the single child element (e.g. a router `<Link>`). */
  asChild?: boolean;
  /** Render as another element/component, e.g. `as={Link}`. */
  as?: React.ElementType;
  /**
   * Render as an anchor (or the configured router link) pointing at this URL. With `download` or a
   * `target` other than `_self` it is always a plain `<a>`, never the router link.
   */
  href?: string;
  /** Link target when rendered as an anchor. */
  target?: string;
  rel?: string;
  download?: boolean | string;
}

/**
 * Button and anchor attributes are both accepted, since `href` / `as` render an `<a>` (or your
 * router link) and the default is a `<button>`.
 */
export type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

/** The element a `Button` or `IconButton` renders: a `<button>`, or an `<a>` when `href` is set. */
export type ButtonElement = HTMLButtonElement | HTMLAnchorElement;

const getSpinnerSize = (size: ButtonSize): number => {
  if (size === 'sm') return 14;
  if (size === 'lg') return 18;
  if (size === 'xl') return 20;
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
    {isLoading && <Loader2 className="field-spinner" size={getSpinnerSize(size)} aria-hidden="true" />}
    {!isLoading && leftIcon && <span className="field-btn-icon-left" aria-hidden="true">{leftIcon}</span>}
    <span className="field-btn-label">{content}</span>
    {!isLoading && rightIcon && <span className="field-btn-icon-right" aria-hidden="true">{rightIcon}</span>}
  </>
);

/** Prevents activation of disabled links (anchors can't be natively disabled). */
const guardDisabledClick =
  (inactive: boolean, onClick?: React.MouseEventHandler<any>) => (e: React.MouseEvent<any>) => {
    if (inactive) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

/**
 * The primary action element. Renders a `<button>` by default, an `<a>` (or configured router link)
 * when `href` is set, or any component via `as` / `asChild` (for custom router links).
 *
 * @example
 * <Button variant="primary" leftIcon={<Plus size={16} />} onClick={create}>New project</Button>
 * <Button as={Link} to="/settings" variant="ghost">Settings</Button>
 */
export const Button = forwardRef<ButtonElement, ButtonProps>(
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
      onClick,
      ...props
    },
    ref
  ) => {
    const tag: React.ElementType = useResolvedTag(as, href, 'button', props);
    const inactive = Boolean(disabled || isLoading);
    const classNames = mergeClassNames(
      'field-btn',
      `field-btn-${variant}`,
      `field-btn-${size}`,
      isFullWidth && 'field-btn-full',
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const innerContent = renderButtonLabel(child.props.children, isLoading, size, leftIcon, rightIcon);

      return renderPolymorphic(
        'button',
        {
          asChild: true,
          className: classNames,
          style,
          'aria-busy': isLoading || undefined,
          'aria-disabled': inactive || undefined,
          onClick: guardDisabledClick(inactive, onClick),
          children: React.cloneElement(child, { children: innerContent }),
          ...props,
        },
        ref
      );
    }

    return renderPolymorphic(
      tag,
      {
        className: classNames,
        style,
        'aria-busy': isLoading || undefined,
        ...getInteractiveElementProps(tag, { href, disabled: inactive, type }),
        onClick: tag === 'button' ? onClick : guardDisabledClick(inactive, onClick),
        children: renderButtonLabel(children, isLoading, size, leftIcon, rightIcon),
        ...props,
      },
      ref
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'download' | 'hrefLang' | 'referrerPolicy'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** The icon to render, e.g. `<Settings size={16} />`. */
  icon: React.ReactNode;
  /** Required: icon-only buttons need a text label for screen readers. */
  'aria-label': string;
  /** With `asChild`, pass the element to render (e.g. a `<Link>`) as the child. */
  children?: React.ReactElement;
  asChild?: boolean;
  as?: React.ElementType;
  /**
   * Render as an anchor (or the `ThemeProvider` router link for internal paths). With `download` or
   * a `target` other than `_self` it is always a plain `<a>`.
   */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * A square, icon-only button. `aria-label` is required so the action is
 * announced to assistive technology.
 *
 * @example
 * <IconButton icon={<Trash2 size={16} />} aria-label="Delete" variant="ghost" />
 */
export const IconButton = forwardRef<ButtonElement, IconButtonProps>(
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
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const tag: React.ElementType = useResolvedTag(as, href, 'button', props);
    const inactive = Boolean(disabled || isLoading);
    const classNames = mergeClassNames(
      'field-btn',
      'field-icon-btn',
      `field-btn-${variant}`,
      `field-btn-${size}`,
      className
    );

    const innerContent = isLoading ? (
      <Loader2 className="field-spinner" size={getSpinnerSize(size)} aria-hidden="true" />
    ) : (
      icon
    );

    if (asChild && React.isValidElement(children)) {
      return renderPolymorphic(
        'button',
        {
          asChild: true,
          className: classNames,
          'aria-label': ariaLabel,
          'aria-busy': isLoading || undefined,
          'aria-disabled': inactive || undefined,
          onClick: guardDisabledClick(inactive, onClick),
          children: React.cloneElement(children as React.ReactElement<any>, { children: innerContent }),
          ...props,
        },
        ref
      );
    }

    return renderPolymorphic(
      tag,
      {
        className: classNames,
        'aria-label': ariaLabel,
        'aria-busy': isLoading || undefined,
        ...getInteractiveElementProps(tag, { href, disabled: inactive, type }),
        onClick: tag === 'button' ? onClick : guardDisabledClick(inactive, onClick),
        children: innerContent,
        ...props,
      },
      ref
    );
  }
);

IconButton.displayName = 'IconButton';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Join buttons into a single segmented unit (shared borders, no gap). Default `true`. */
  attached?: boolean;
  children: React.ReactNode;
}

/**
 * Groups related buttons. Attached by default; set `attached={false}` for a
 * spaced toolbar row.
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  attached = true,
  className = '',
  role = 'group',
  ...props
}) => {
  return (
    <div
      role={role}
      className={mergeClassNames('field-btn-group', !attached && 'field-btn-group-spaced', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  /** Accessible label when `label` is an icon. */
  'aria-label'?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
  /** Stretch segments to fill the container width. */
  isFullWidth?: boolean;
  /** Accessible name for the group, e.g. "View mode". */
  'aria-label'?: string;
  disabled?: boolean;
}

/**
 * A compact single-choice toggle (like a radio group styled as joined
 * buttons). Arrow keys move between options.
 *
 * @example
 * <SegmentedControl aria-label="Range" value={range} onChange={setRange}
 *   options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7d' }]} />
 */
export function SegmentedControl<T extends string = string>(props: Readonly<SegmentedControlProps<T>>) {
  const {
    options,
    value,
    onChange,
    className = '',
    size = 'md',
    isFullWidth = false,
    disabled = false,
    'aria-label': ariaLabel,
  } = props;
  const groupRef = useRef<HTMLDivElement>(null);
  const hasSelection = options.some(opt => opt.value === value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const handled = handleListKeyNavigation(e, groupRef.current, '[role="radio"]', 'horizontal');
    if (!handled) return;
    const focused = document.activeElement as HTMLElement | null;
    const nextValue = focused?.dataset.value as T | undefined;
    if (nextValue !== undefined) onChange(nextValue);
  };

  return (
    <div
      ref={groupRef}
      className={mergeClassNames(
        'field-segmented-control',
        `field-segmented-control-${size}`,
        isFullWidth && 'field-segmented-control-full',
        className
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        const isTabStop = isActive || (!hasSelection && idx === 0);
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt['aria-label']}
            data-value={opt.value}
            disabled={isDisabled}
            tabIndex={isTabStop ? 0 : -1}
            className={mergeClassNames('field-segmented-item', isActive && 'active')}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
