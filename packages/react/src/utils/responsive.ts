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

/**
 * Breakpoint ranges, each from its breakpoint up to the next one (`base` is below 640px). Range-scoped
 * classes in field.css (e.g. `.field-gallery-hidden-md`) apply only inside their range.
 */
export const BREAKPOINT_RANGES = RESPONSIVE_KEYS;
export type BreakpointRange = (typeof RESPONSIVE_KEYS)[number];

/**
 * Resolves a possibly-responsive value to one value per range, mobile first: each range inherits
 * the nearest smaller one that is set, and ranges below the first set value get `fallback`.
 */
export function resolvePerRange<T>(value: Responsive<T>, fallback: T): Record<BreakpointRange, T> {
  const values = (isResponsiveObject(value) ? value : { base: value }) as Partial<Record<BreakpointRange, T>>;
  const out = {} as Record<BreakpointRange, T>;
  let current = fallback;
  for (const range of RESPONSIVE_KEYS) {
    if (values[range] !== undefined) current = values[range] as T;
    out[range] = current;
  }
  return out;
}

function isResponsiveObject<T>(value: Responsive<T> | undefined): boolean {
  return typeof value === 'object' && value !== null && RESPONSIVE_KEYS.some(k => k in (value as object));
}

/** Collects the inline style and classes produced by responsive props. */
export interface ResponsiveAccumulator {
  style: Record<string, unknown>;
  classes: string[];
}

/** Starts an empty `{ style, classes }` collector for `applyResponsive`. For building your own components with breakpoint-object props. */
export const createResponsiveAccumulator = (): ResponsiveAccumulator => ({ style: {}, classes: [] });

const FIELD_R_KEYS = new Set(['ta', 'fd', 'ai', 'jc', 'fw', 'gap', 'p', 'gtc', 'cpv', 'cgap', 'psz', 'plh', 'dvr', 'gaf', 'dvs']);

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
