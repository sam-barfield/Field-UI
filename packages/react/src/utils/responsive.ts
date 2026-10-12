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

export type SpaceValue = number | string;

/** Resolves a numeric pixel value or token key (e.g. `$4`) to a CSS value. */
export function resolveSpace(value: SpaceValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (value.startsWith('$')) return `var(--field-space-${value.slice(1).replace('.', '_')})`;
  return value;
}

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

const FIELD_R_KEYS = new Set(['ta', 'fd', 'ai', 'jc', 'fw', 'gap', 'p', 'gtc', 'cpv', 'cgap', 'psz', 'plh', 'dvr', 'gaf']);

/**
 * Applies a possibly-responsive prop: a single value becomes an inline style (or CSS variable for layout props); a
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
  const isObject = isResponsiveObject(value);
  if (!isObject && !FIELD_R_KEYS.has(key)) {
    acc.style[cssProperty] = toCss(value as T);
    return;
  }
  // Every breakpoint variable is written, even for a single value: the media-query
  // classes read them without fallbacks, and custom properties inherit, so a missing
  // one would pick up an outer responsive element's value. `initial` (guaranteed-invalid)
  // leaves the property at its own default for breakpoints below the first value.
  const values = (isObject ? value : { base: value }) as Record<string, T | undefined>;
  let current: T | undefined = fallback;
  for (const bp of RESPONSIVE_KEYS) {
    const next = values[bp];
    if (next !== undefined) current = next;
    acc.style[`--field-r-${key}-${bp}`] = current !== undefined ? toCss(current) : 'initial';
  }
  acc.classes.push(`field-r-${key}`);
}
