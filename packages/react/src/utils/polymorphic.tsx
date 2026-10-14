import React, { cloneElement, isValidElement } from 'react';
import { getElementRef, mergeRefs } from './hooks.js';
import { mergeClassNames } from './classNames.js';
import { useLinkComponent } from '../theme/ThemeProvider.js';

export { mergeClassNames };

/**
 * True for hrefs a client-side router can't handle: any URL with a scheme (`https:`, `mailto:`,
 * `tel:`, `sms:`, `data:` …), protocol-relative URLs (`//cdn…`) and same-page anchors (`#id`).
 */
export const isExternalHref = (href?: string): boolean => {
  if (!href) return false;
  return /^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(href);
};

/** The link attributes `resolveTag` checks before handing an `href` to the router link. */
export interface LinkBehaviorProps {
  download?: unknown;
  target?: unknown;
}

/**
 * True when the browser itself must handle the click: a `download` link, or a `target` other
 * than `_self` (e.g. `_blank`). A client-side router link would intercept the click and
 * navigate in-app instead, breaking the download or new-tab behaviour.
 */
export const needsNativeLink = (attrs?: LinkBehaviorProps): boolean =>
  attrs != null &&
  ((attrs.download !== undefined && attrs.download !== false) ||
    (typeof attrs.target === 'string' && attrs.target !== '' && attrs.target !== '_self'));

/**
 * Resolves the rendered element or component for interactive items.
 *
 * Honors `as` first, then `linkComponent` when `href` is present and internal,
 * falling back to `a` or the specified `defaultTag`. External hrefs, and links with
 * `download` or a `target` other than `_self` (pass them as `linkAttrs`), always render a
 * plain `<a>`. Not a hook: use it inside loops with a `linkComponent` read once from
 * `useLinkComponent()`.
 */
export function resolveTag(
  linkComponent: React.ElementType | undefined,
  as?: React.ElementType,
  href?: string,
  defaultTag: React.ElementType = 'a',
  linkAttrs?: LinkBehaviorProps
): React.ElementType {
  if (as) return as;
  if (href) {
    if (isExternalHref(href) || needsNativeLink(linkAttrs)) return 'a';
    return linkComponent ?? 'a';
  }
  return defaultTag;
}

/** `resolveTag` with the provider-level `linkComponent` from `ThemeProvider`. */
export function useResolvedTag(
  as?: React.ElementType,
  href?: string,
  defaultTag: React.ElementType = 'a',
  linkAttrs?: LinkBehaviorProps
): React.ElementType {
  return resolveTag(useLinkComponent(), as, href, defaultTag, linkAttrs);
}

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
