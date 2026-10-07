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

