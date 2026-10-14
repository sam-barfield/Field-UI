import { FieldSemanticTokens, FieldTheme } from '../types.js';

/** The semantic tokens of the high-contrast dark theme. */
export const highContrastDarkSemantics: FieldSemanticTokens = {
  name: 'Field High-Contrast Dark',
  mode: 'dark',
  surfaces: {
    base: '#000000',
    raised: '#0D0D0D',
    overlay: '#141414',
    sunken: '#000000',
    subtle: '#1C1C1C',
    active: '#2A2A2A',
  },
  borders: {
    subtle: 'rgba(255, 255, 255, 0.25)',
    default: 'rgba(255, 255, 255, 0.45)',
    strong: '#FFFFFF',
    focus: '#60A5FA',
    highlight: '#FFFFFF',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#E2E8F0',
    tertiary: '#94A3B8',
    inverse: '#000000',
    disabled: '#64748B',
  },
  accent: {
    primary: '#60A5FA',
    hover: '#93C5FD',
    active: '#3B82F6',
    subtle: 'rgba(96, 165, 250, 0.25)',
    subtleHover: 'rgba(96, 165, 250, 0.35)',
    contrast: '#000000',
  },
  status: {
    success: {
      base: '#34D399',
      surface: 'rgba(52, 211, 153, 0.2)',
      border: '#34D399',
      text: '#A7F3D0',
    },
    warning: {
      base: '#FBBF24',
      surface: 'rgba(251, 191, 36, 0.2)',
      border: '#FBBF24',
      text: '#FDE68A',
    },
    danger: {
      base: '#F87171',
      surface: 'rgba(248, 113, 113, 0.2)',
      border: '#F87171',
      text: '#FECACA',
    },
    info: {
      base: '#38BDF8',
      surface: 'rgba(56, 189, 248, 0.2)',
      border: '#38BDF8',
      text: '#BAE6FD',
    },
  },
};

/** A dark theme with stronger text, border and focus contrast, for users who need it. */
export const highContrastDarkTheme: FieldTheme = {
  id: 'field-high-contrast-dark',
  label: 'High-Contrast Dark',
  mode: 'dark',
  semantics: highContrastDarkSemantics,
};
