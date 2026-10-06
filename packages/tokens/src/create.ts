import { FieldPrimitiveTokens, FieldSemanticTokens, FieldTheme, FieldThemePair } from './types.js';
import { darkTheme } from './themes/dark.js';
import { lightTheme } from './themes/light.js';

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

  return {
    id: options.id,
    label,
    mode,
    semantics: {
      ...mergeGroup(base.semantics, options.semantics as DeepPartial<FieldSemanticTokens>),
      name: label,
      mode,
    },
    radiiOverrides: { ...base.radiiOverrides, ...options.radii },
    fonts: base.fonts || options.fonts ? { ...base.fonts, ...options.fonts } : undefined,
  };
}

export interface CreateThemePairOptions {
  id: string;
  label?: string;
  /** Overrides applied to both modes (radii, shared status colours, ...). */
  shared?: Pick<CreateThemeOptions, 'semantics' | 'radii' | 'fonts'>;
  dark?: Omit<CreateThemeOptions, 'id' | 'mode'> & { id?: string };
  light?: Omit<CreateThemeOptions, 'id' | 'mode'> & { id?: string };
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
    });
  };

  return { id: options.id, label, dark: build('dark'), light: build('light') };
}
