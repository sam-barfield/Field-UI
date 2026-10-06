'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** `useLayoutEffect` on the client, `useEffect` on the server (avoids SSR warnings). */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * State that can be either controlled (`value` provided) or uncontrolled
 * (`defaultValue`), calling `onChange` in both cases.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  return [current, setValue];
}

type PossibleRef<T> = React.Ref<T> | undefined;

/** Combine several refs (callback or object) into one callback ref. */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return node => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Read the ref attached to a React element in a way that works in React 18
 * (`element.ref`) and React 19 (`element.props.ref`, where `element.ref` warns).
 */
export function getElementRef(element: React.ReactElement): React.Ref<unknown> | undefined {
  const propsGetter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get as
    | { isReactWarning?: boolean }
    | undefined;
  if (propsGetter && propsGetter.isReactWarning) return (element as any).ref;

  const elementGetter = Object.getOwnPropertyDescriptor(element, 'ref')?.get as
    | { isReactWarning?: boolean }
    | undefined;
  if (elementGetter && elementGetter.isReactWarning) return (element.props as any).ref;

  return (element.props as any).ref ?? (element as any).ref;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** All keyboard-focusable descendants of `container`, in DOM order. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    el => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null
  );
}

/* --- Scroll lock (reference counted so nested overlays don't fight) --- */
let scrollLockCount = 0;
let savedBodyStyle: { overflow: string; paddingRight: string } | null = null;

/** Prevent the page behind an overlay from scrolling while `active` is true. */
export function useScrollLock(active: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const body = document.body;
    if (scrollLockCount === 0) {
      savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    scrollLockCount += 1;
    return () => {
      scrollLockCount -= 1;
      if (scrollLockCount === 0 && savedBodyStyle) {
        body.style.overflow = savedBodyStyle.overflow;
        body.style.paddingRight = savedBodyStyle.paddingRight;
        savedBodyStyle = null;
      }
    };
  }, [active]);
}

/* --- Dismissable layer stack (Escape / outside click only affect the topmost layer) --- */
const layerStack: symbol[] = [];

export interface DismissableLayerOptions {
  /** Elements that count as "inside" the layer (trigger, panel, ...). */
  refs: React.RefObject<HTMLElement | null>[];
  onDismiss: () => void;
  /** Close on Escape. Default `true`. */
  escape?: boolean;
  /** Close on pointer down outside `refs`. Default `true`. */
  outsidePress?: boolean;
}

/**
 * Close a popover/menu/dialog on Escape or outside press. When several layers
 * are open (a select inside a modal), only the topmost one responds.
 */
export function useDismissableLayer(active: boolean, options: DismissableLayerOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const id = Symbol('field-layer');
    layerStack.push(id);
    const isTop = () => layerStack[layerStack.length - 1] === id;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || optionsRef.current.escape === false || !isTop()) return;
      e.stopPropagation();
      optionsRef.current.onDismiss();
    };
    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (optionsRef.current.outsidePress === false || !isTop()) return;
      const target = e.target as Node;
      const inside = optionsRef.current.refs.some(ref => ref.current?.contains(target));
      if (!inside) optionsRef.current.onDismiss();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      const idx = layerStack.indexOf(id);
      if (idx !== -1) layerStack.splice(idx, 1);
    };
  }, [active]);
}

/**
 * Trap Tab focus inside `containerRef` while active, move focus into it on
 * open, and restore focus to the previously focused element on close.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  options: { initialFocusRef?: React.RefObject<HTMLElement | null>; restoreFocus?: boolean } = {}
) {
  const { initialFocusRef, restoreFocus = true } = options;

  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (!container.contains(document.activeElement)) {
      const target = initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
      target.focus({ preventScroll: true });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, initialFocusRef, restoreFocus]);
}

/**
 * Arrow-key navigation between items matching `selector` inside `container`.
 * Returns true when the key was handled.
 */
export function handleListKeyNavigation(
  e: React.KeyboardEvent | KeyboardEvent,
  container: HTMLElement | null,
  selector: string,
  orientation: 'vertical' | 'horizontal' = 'vertical'
): boolean {
  if (!container) return false;
  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  if (![prevKey, nextKey, 'Home', 'End'].includes(e.key)) return false;

  const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    el => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true'
  );
  if (items.length === 0) return false;

  e.preventDefault();
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  let nextIndex: number;
  if (e.key === 'Home') nextIndex = 0;
  else if (e.key === 'End') nextIndex = items.length - 1;
  else if (e.key === nextKey) nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
  else nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;

  items[nextIndex].focus();
  return true;
}

/** Stable unique id that is safe inside CSS selectors and SVG `url(#id)` refs. */
export function useSafeId(prefix = 'field'): string {
  const raw = React.useId();
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/* --- Anchored positioning for portalled popovers, menus and listboxes --- */

export interface AnchoredPositionOptions {
  /** Preferred side; flips automatically when there is not enough room. Default `bottom`. */
  placement?: 'bottom' | 'top';
  /** Horizontal alignment relative to the anchor. Default `start`. */
  align?: 'start' | 'center' | 'end';
  /** Gap between anchor and floating element in px. Default 6. */
  offset?: number;
  /** Make the floating element at least as wide as the anchor. */
  matchWidth?: boolean;
}

/**
 * Positions a `position: fixed` floating element next to an anchor, keeping
 * it inside the viewport and following scroll/resize. Rendering the floating
 * element in a portal with this style avoids clipping by `overflow` parents.
 */
export function useAnchoredPosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  floatingRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  { placement = 'bottom', align = 'start', offset = 6, matchWidth = false }: AnchoredPositionOptions = {}
) {
  const [state, setState] = useState<{ style: React.CSSProperties; side: 'top' | 'bottom' }>({
    // Positioned in a layout effect before paint, so no hidden phase is needed
    // (a hidden element can't receive focus when menus open).
    style: { position: 'fixed', top: 0, left: 0 },
    side: placement,
  });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor || typeof window === 'undefined') return;
    const floating = floatingRef.current;
    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const floatingWidth = Math.max(floating?.offsetWidth ?? 0, matchWidth ? rect.width : 0);
    const floatingHeight = floating?.offsetHeight ?? 0;

    const spaceBelow = viewportHeight - rect.bottom - offset - margin;
    const spaceAbove = rect.top - offset - margin;
    let side = placement;
    if (side === 'bottom' && floatingHeight > spaceBelow && spaceAbove > spaceBelow) side = 'top';
    else if (side === 'top' && floatingHeight > spaceAbove && spaceBelow > spaceAbove) side = 'bottom';

    const available = Math.max(120, side === 'bottom' ? spaceBelow : spaceAbove);
    const renderedHeight = Math.min(floatingHeight, available);
    const top = side === 'bottom' ? rect.bottom + offset : rect.top - offset - renderedHeight;

    let left: number;
    if (align === 'end') left = rect.right - floatingWidth;
    else if (align === 'center') left = rect.left + rect.width / 2 - floatingWidth / 2;
    else left = rect.left;
    left = Math.max(margin, Math.min(left, viewportWidth - floatingWidth - margin));

    setState({
      side,
      style: {
        position: 'fixed',
        top: Math.round(top),
        left: Math.round(left),
        minWidth: matchWidth ? Math.round(rect.width) : undefined,
        maxHeight: Math.round(available),
      },
    });
  }, [anchorRef, floatingRef, placement, align, offset, matchWidth]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    update();
    // Measure again once the floating element has rendered at its natural size.
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && floatingRef.current) {
      observer = new ResizeObserver(update);
      observer.observe(floatingRef.current);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [open, update]);

  return { style: state.style, side: state.side, update };
}

/**
 * Track a CSS media query. Returns `defaultValue` during SSR and the first render.
 *
 * @example
 * const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** True when the user asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
