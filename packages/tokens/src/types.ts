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
    contrast: string;
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

export interface FieldTheme {
  id: string;
  label: string;
  mode: 'dark' | 'light';
  semantics: FieldSemanticTokens;
  radiiOverrides?: Partial<FieldPrimitiveTokens['radii']>;
}
