export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface FieldPrimitiveTokens {
  colors: {
    neutrals: {
      obsidian: ColorScale;
      zinc: ColorScale;
      slate: ColorScale;
      graphite: ColorScale;
    };
    accents: {
      cobalt: ColorScale;
      emerald: ColorScale;
      violet: ColorScale;
      amber: ColorScale;
      crimson: ColorScale;
      cyan: ColorScale;
    };
  };
  spacing: Record<string, string>;
  radii: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  typography: {
    fonts: {
      sans: string;
      mono: string;
      display: string;
    };
    sizes: Record<string, { size: string; lineHeight: string; tracking: string }>;
    weights: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  shadows: Record<string, string>;
  motion: {
    durations: {
      instant: string;
      fast: string;
      normal: string;
      deliberate: string;
    };
    easings: {
      default: string;
      in: string;
      out: string;
      inOut: string;
      spring: string;
    };
  };
}

export interface FieldSemanticTokens {
  name: string;
  mode: 'dark' | 'light';
  surfaces: {
    base: string;
    raised: string;
    overlay: string;
    sunken: string;
    subtle: string;
    active: string;
  };
  borders: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
    highlight: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
  };
  accent: {
    primary: string;
    hover: string;
    active: string;
    subtle: string;
    subtleHover: string;
    /** Text and icons on `primary` fills (buttons, badges). */
    contrast: string;
    /**
     * Accent used as foreground on surfaces (links, `Text tone="accent"`, active nav items).
     * Defaults to `primary`. Set it when no single colour works both as a fill behind
     * `contrast` text and as readable text on `surfaces.base` (common for red or yellow
     * brands in dark mode).
     */
    text?: string;
  };
  status: {
    success: {
      base: string;
      surface: string;
      border: string;
      text: string;
    };
    warning: {
      base: string;
      surface: string;
      border: string;
      text: string;
    };
    danger: {
      base: string;
      surface: string;
      border: string;
      text: string;
    };
    info: {
      base: string;
      surface: string;
      border: string;
      text: string;
    };
  };
}

/** Heading typography overrides. Every field is optional; omitted values keep Field's defaults. */
export interface FieldTypographyOverrides {
  /** Weight of level 2–4 headings and prose headings. Default `600`. */
  headingWeight?: number;
  /** Weight of level 1 and display headings. Default `700`. */
  displayWeight?: number;
  /** Multiplier for the negative heading letter-spacing: `0` removes it, `1` is the default, `1.5` is tighter. */
  headingTracking?: number;
  /** `font-stretch` for headings, e.g. `'condensed'` or `'87.5%'` with a variable-width font. Default `normal`. */
  headingStretch?: string;
}

type FieldButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button overrides, written to `--field-btn-*` variables. Every field is optional; omitted values
 * keep Field's defaults. Each value is any CSS value.
 */
export interface FieldButtonOverrides {
  /** Height per size. Defaults: `sm` 30px, `md` 36px, `lg` 44px, `xl` 48px. */
  height?: Partial<Record<FieldButtonSize, string>>;
  /** Horizontal padding per size. Defaults: `sm` 12px, `md` 16px, `lg` 22px, `xl` 28px. */
  paddingX?: Partial<Record<FieldButtonSize, string>>;
  /** Font size per size. Defaults: `sm` 0.8125rem, `md` 0.875rem, `lg` 0.9375rem, `xl` 1rem. */
  fontSize?: Partial<Record<FieldButtonSize, string>>;
  /** Corner radius of every size. Default: the `sm` radius for small buttons, `md` for medium and large, `lg` for `xl`. */
  radius?: string;
  /** Default `550`. */
  fontWeight?: number | string;
  /** Default `-0.01em`. */
  letterSpacing?: string;
  /** e.g. `uppercase`. Default `none`. */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Shadow of filled buttons (primary, secondary, danger) at rest. Default: the theme's `xs` shadow. */
  shadow?: string;
  /** Shadow on hover. Default: the theme's `sm` shadow. */
  shadowHover?: string;
  /** Shadow while pressed. Default: the theme's `inset` shadow. */
  shadowActive?: string;
  /** Transform while pressed, e.g. `translateY(1px)` or `none`. Default `scale(0.98)`. */
  pressTransform?: string;
}

export interface FieldTheme {
  id: string;
  label: string;
  mode: 'dark' | 'light';
  semantics: FieldSemanticTokens;
  radiiOverrides?: Partial<FieldPrimitiveTokens['radii']>;
  /**
   * Font stack overrides. `display` is used by headings, `sans` by body text and controls.
   * Fonts are not loaded for you: add the webfont (e.g. a Google Fonts link) yourself.
   */
  fonts?: Partial<FieldPrimitiveTokens['typography']['fonts']>;
  /** Heading weight, tracking and width overrides. */
  typography?: FieldTypographyOverrides;
  /** Button size, lettering, shadow and press-effect overrides. */
  button?: FieldButtonOverrides;
}

export interface FieldThemePair {
  id: string;
  label: string;
  dark: FieldTheme;
  light: FieldTheme;
  /**
   * Dark theme for forced-dark bands: `Section backgroundImage` and `tone="inverse"` on a light
   * page. Defaults to `dark`. Use it when the bands need different tokens from dark mode, e.g.
   * the true brand colour with white button text on a photo, where dark mode uses a lighter tint.
   */
  band?: FieldTheme;
}

