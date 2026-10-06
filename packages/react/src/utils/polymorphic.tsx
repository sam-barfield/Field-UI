import React, { cloneElement, isValidElement } from 'react';
import { getElementRef, mergeRefs } from './hooks.js';

export interface PolymorphicProps {
  /** Merge this component's props onto its single child element instead of rendering its own (e.g. a router `<Link>`). */
  asChild?: boolean;
  /** Render as a different element or component, e.g. `as={Link}` or `as="a"`. */
  as?: React.ElementType;
}

/**
 * Merges two event handlers so that both are executed in sequence.
 * The second handler is skipped if the first called `event.preventDefault()`.
 */
export function composeEventHandlers<E extends React.SyntheticEvent>(
  originalHandler?: (event: E) => void,
  ourHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return (event: E) => {
    originalHandler?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ourHandler?.(event);
    }
  };
}

/**
 * Merges class names, filtering out falsy values.
 */
export function mergeClassNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Props that only make sense for a particular rendered element.
 *
 * `type` and `disabled` are valid on `<button>` but not on `<a>`; links get
 * `aria-disabled` and lose their `href` instead. Custom components (`as={Link}`)
 * receive `href` and `aria-disabled` so they can decide for themselves.
 */
export function getInteractiveElementProps(
  tag: React.ElementType,
  { href, disabled, type = 'button' }: { href?: string; disabled?: boolean; type?: string }
): Record<string, unknown> {
  if (tag === 'button') {
    return { type, disabled };
  }
  if (tag === 'a') {
    return {
      href: disabled ? undefined : href,
      'aria-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : undefined,
    };
  }
  if (typeof tag === 'string') {
    return { 'aria-disabled': disabled || undefined };
  }
  return { href: disabled ? undefined : href, 'aria-disabled': disabled || undefined };
}

/**
 * Renders a component polymorphically supporting `asChild`, `as`, or a default tag.
 */
export function renderPolymorphic(
  defaultTag: React.ElementType,
  props: {
    asChild?: boolean;
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<any>;
    key?: React.Key;
    [key: string]: any;
  },
  ref?: React.ForwardedRef<any>
) {
  const { asChild, as, children, className, style, onClick, key, ...restProps } = props;

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const childProps = child.props || {};

    const mergedProps: Record<string, any> = {
      ...restProps,
      ...childProps,
      className: mergeClassNames(className, childProps.className),
      style: { ...style, ...childProps.style },
      onClick: composeEventHandlers(childProps.onClick, onClick),
    };

    if (ref) {
      mergedProps.ref = mergeRefs(getElementRef(child) as React.Ref<unknown>, ref);
    }

    return cloneElement(child, {
      ...(key !== undefined ? { key } : {}),
      ...mergedProps,
    });
  }

  const Component = as || defaultTag;
  return (
    <Component
      key={key}
      ref={ref}
      className={className}
      style={style}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Component>
  );
}
