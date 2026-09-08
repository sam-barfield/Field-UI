import React, { cloneElement, isValidElement } from 'react';

export interface PolymorphicProps {
  asChild?: boolean;
  as?: React.ElementType;
}

/**
 * Merges two event handlers so that both are executed in sequence.
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
export function mergeClassNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
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
      const childRef = (child as any).ref;
      mergedProps.ref = (node: any) => {
        if (typeof childRef === 'function') childRef(node);
        else if (childRef && typeof childRef === 'object') (childRef as any).current = node;

        if (typeof ref === 'function') ref(node);
        else if (typeof ref === 'object') (ref as any).current = node;
      };
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
