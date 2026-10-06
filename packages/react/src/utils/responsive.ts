/** Viewport breakpoints (min-width): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Pixel widths of the breakpoints, for JS use (e.g. with `useMediaQuery`). */
export const breakpoints: Record<Breakpoint, number> = { sm: 640, md: 768, lg: 1024, xl: 1280 };

/**
 * A prop that is either a single value or a value per breakpoint, mobile first:
 * `direction={{ base: 'column', md: 'row' }}` stacks on phones and becomes a row from 768px.
 * Each breakpoint inherits the nearest smaller one that is set.
 */
export type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };

const RESPONSIVE_KEYS = ['base', 'sm', 'md', 'lg', 'xl'] as const;

function isResponsiveObject<T>(value: Responsive<T> | undefined): boolean {
  return typeof value === 'object' && value !== null && RESPONSIVE_KEYS.some(k => k in (value as object));
}

/** Collects the inline style and classes produced by responsive props. */
export interface ResponsiveAccumulator {
  style: Record<string, unknown>;
  classes: string[];
}

export const createResponsiveAccumulator = (): ResponsiveAccumulator => ({ style: {}, classes: [] });

/**
 * Applies a possibly-responsive prop: a single value becomes an inline style; a
 * breakpoint object becomes `--field-r-<key>-<bp>` variables read by the
 * `.field-r-<key>` media-query classes in field.css. Pass a custom property
 * (e.g. `--field-carousel-per-view`) as `cssProperty` to drive component CSS.
 */
export function applyResponsive<T>(
  acc: ResponsiveAccumulator,
  key: string,
  cssProperty: string,
  value: Responsive<T> | undefined,
  toCss: (v: T) => unknown = v => v,
  fallback?: T
) {
  if (value === undefined) return;
  if (!isResponsiveObject(value)) {
    acc.style[cssProperty] = toCss(value as T);
    return;
  }
  let current: T | undefined = fallback;
  for (const bp of RESPONSIVE_KEYS) {
    const next = (value as Record<string, T | undefined>)[bp];
    if (next !== undefined) current = next;
    if (current !== undefined) acc.style[`--field-r-${key}-${bp}`] = toCss(current);
  }
  acc.classes.push(`field-r-${key}`);
}
