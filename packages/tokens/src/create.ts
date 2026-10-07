import { FieldPrimitiveTokens, FieldSemanticTokens, FieldTheme, FieldThemePair, FieldTypographyOverrides } from './types.js';
import { darkTheme } from './themes/dark.js';
import { lightTheme } from './themes/light.js';
import { checkThemeContrast } from './contrast.js';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export type FieldSemanticOverrides = DeepPartial<Omit<FieldSemanticTokens, 'name' | 'mode'>>;

export interface CreateThemeOptions {
  /** Unique id, written to `data-field-theme` on the themed element. */
  id: string;
  /** Human readable name, shown in theme pickers. */
  label?: string;
  /** Theme to inherit from. Defaults to the built-in dark or light theme for `mode`. */
  base?: FieldTheme;
  /** Mode of the new theme. Defaults to the base theme's mode, or `'dark'`. */
  mode?: 'dark' | 'light';
  /** Semantic token overrides; anything omitted is inherited from `base`. */
  semantics?: FieldSemanticOverrides;
  /** Radius overrides, e.g. `{ md: '4px' }` for a sharper look. */
  radii?: Partial<FieldPrimitiveTokens['radii']>;
  /** Font stack overrides, e.g. `{ display: '"Fraunces", Georgia, serif' }`. Load the webfont yourself. */
  fonts?: Partial<FieldPrimitiveTokens['typography']['fonts']>;
  /** Heading weight, tracking and width, e.g. `{ displayWeight: 800, headingTracking: 0.5 }`. */
  typography?: FieldTypographyOverrides;
  /**
   * Check WCAG contrast of the resulting theme and `console.warn` every failing pairing
   * (see `checkThemeContrast`). Useful while designing a brand theme; leave it off in production.
   */
  checkContrast?: boolean;
}

function mergeGroup<T extends object>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const baseValue = (base as Record<string, unknown>)[key];
    out[key] =
      value && typeof value === 'object' && baseValue && typeof baseValue === 'object'
        ? mergeGroup(baseValue as object, value as DeepPartial<object>)
        : value;
  }
  return out as T;
}

/**
 * Build a theme by overriding only the tokens you care about.
 *
 * @example
 * const brand = createTheme({
 *   id: 'acme-dark',
 *   semantics: { accent: { primary: '#E11D48', hover: '#F43F5E', active: '#BE123C' } },
 *   radii: { md: '4px', lg: '6px' },
 * });
 */
export function createTheme(options: CreateThemeOptions): FieldTheme {
  const mode = options.mode ?? options.base?.mode ?? 'dark';
  const base = options.base ?? (mode === 'light' ? lightTheme : darkTheme);
  const label = options.label ?? options.id;

  const semantics = mergeGroup(base.semantics, options.semantics as DeepPartial<FieldSemanticTokens>);
  // accent.text is tuned to the base's accent colour. A new accent.primary without its own
  // text would otherwise inherit links in the base theme's colour, so fall back to primary.
  const accentOverride = options.semantics?.accent;
  if (accentOverride?.primary !== undefined && accentOverride.text === undefined) {
    const { text: _inherited, ...accent } = semantics.accent;
    semantics.accent = accent;
  }

  const theme: FieldTheme = {
    id: options.id,
    label,
    mode,
    semantics: {
      ...semantics,
      name: label,
      mode,
    },
    radiiOverrides: { ...base.radiiOverrides, ...options.radii },
    fonts: base.fonts || options.fonts ? { ...base.fonts, ...options.fonts } : undefined,
    typography:
      base.typography || options.typography ? { ...base.typography, ...options.typography } : undefined,
  };

  if (options.checkContrast) {
    const failures = checkThemeContrast(theme).filter(check => !check.pass);
    for (const f of failures) {
      console.warn(
        `[field] ${theme.id}: ${f.label} is ${f.ratio.toFixed(2)}:1 (needs ${f.minimum}:1) - ${f.foreground} on ${f.background}`
      );
    }
  }

  return theme;
}

export interface CreateThemePairOptions {
  id: string;
  label?: string;
  /** Overrides applied to both modes (radii, fonts, heading typography, shared status colours, ...). */
  shared?: Pick<CreateThemeOptions, 'semantics' | 'radii' | 'fonts' | 'typography'>;
  dark?: Omit<CreateThemeOptions, 'id' | 'mode' | 'checkContrast'> & { id?: string };
  light?: Omit<CreateThemeOptions, 'id' | 'mode' | 'checkContrast'> & { id?: string };
  /**
   * Overrides for forced-dark bands (photo sections, `tone="inverse"` on a light page), applied on
   * top of the pair's dark theme. Omit it and bands use the dark theme unchanged.
   */
  band?: Pick<CreateThemeOptions, 'semantics' | 'radii' | 'fonts' | 'typography' | 'label'> & { id?: string };
  /** Check WCAG contrast of every generated theme and `console.warn` failures. */
  checkContrast?: boolean;
}

/**
 * Build a dark + light theme pair so `toggleMode()` switches between them.
 *
 * @example
 * const acme = createThemePair({
 *   id: 'acme',
 *   dark: { semantics: { accent: { primary: '#E11D48' } } },
 *   light: { semantics: { accent: { primary: '#BE123C' } } },
 * });
 * <ThemeProvider themePair={acme}>…</ThemeProvider>
 *
 * @example
 * // Dark mode uses a lighter red for links; photo bands keep the true brand red.
 * createThemePair({
 *   id: 'brand',
 *   light: { semantics: { accent: { primary: '#D00000' } } },
 *   dark: { semantics: { accent: { primary: '#FF5C52', contrast: '#140405' } } },
 *   band: { semantics: { accent: { primary: '#D00000', contrast: '#FFFFFF' } } },
 * });
 */
export function createThemePair(options: CreateThemePairOptions): FieldThemePair {
  const label = options.label ?? options.id;
  const build = (mode: 'dark' | 'light') => {
    const variant = options[mode] ?? {};
    return createTheme({
      ...variant,
      id: variant.id ?? `${options.id}-${mode}`,
      label: variant.label ?? `${label} ${mode === 'dark' ? 'Dark' : 'Light'}`,
      mode,
      semantics: mergeGroup(
        (options.shared?.semantics ?? {}) as FieldSemanticOverrides,
        variant.semantics as DeepPartial<FieldSemanticOverrides>
      ),
      radii: { ...options.shared?.radii, ...variant.radii },
      fonts: options.shared?.fonts || variant.fonts ? { ...options.shared?.fonts, ...variant.fonts } : undefined,
      typography:
        options.shared?.typography || variant.typography
          ? { ...options.shared?.typography, ...variant.typography }
          : undefined,
      checkContrast: options.checkContrast,
    });
  };

  const dark = build('dark');
  const pair: FieldThemePair = { id: options.id, label, dark, light: build('light') };
  if (options.band) {
    pair.band = createTheme({
      ...options.band,
      id: options.band.id ?? `${options.id}-band`,
      label: options.band.label ?? `${label} Band`,
      base: dark,
      mode: 'dark',
      checkContrast: options.checkContrast,
    });
  }
  return pair;
}
