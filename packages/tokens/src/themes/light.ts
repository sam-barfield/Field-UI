import { FieldSemanticTokens, FieldTheme } from '../types.js';

/** The semantic tokens of the default light theme. */
export const lightSemantics: FieldSemanticTokens = {
  name: 'Field Architectural Light',
  mode: 'light',
  surfaces: {
    base: '#F8FAFC',
    raised: '#FFFFFF',
    overlay: '#FFFFFF',
    sunken: '#EEF2F6',
    subtle: '#F1F5F9',
    active: '#E2E8F0',
  },
  borders: {
    subtle: 'rgba(15, 23, 42, 0.06)',
    default: 'rgba(15, 23, 42, 0.12)',
    strong: 'rgba(15, 23, 42, 0.22)',
    focus: '#2563EB',
    highlight: 'rgba(255, 255, 255, 0.8)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#5C6F8A',
    inverse: '#F8FAFC',
    disabled: '#CBD5E1',
  },
  accent: {
    primary: '#2563EB',
    hover: '#1D4ED8',
    active: '#1E40AF',
    subtle: 'rgba(37, 99, 235, 0.08)',
    subtleHover: 'rgba(37, 99, 235, 0.15)',
    contrast: '#FFFFFF',
    // A touch darker than primary so links stay above 4.5:1 on accent-subtle tints.
    text: '#2060EB',
  },
  status: {
    success: {
      base: '#059669',
      surface: 'rgba(5, 150, 105, 0.08)',
      border: 'rgba(5, 150, 105, 0.2)',
      text: '#047857',
    },
    warning: {
      base: '#D97706',
      surface: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.2)',
      text: '#AD5009',
    },
    danger: {
      base: '#DC2626',
      surface: 'rgba(220, 38, 38, 0.08)',
      border: 'rgba(220, 38, 38, 0.2)',
      text: '#B91C1C',
    },
    info: {
      base: '#0891B2',
      surface: 'rgba(8, 145, 178, 0.08)',
      border: 'rgba(8, 145, 178, 0.2)',
      text: '#0E7490',
    },
  },
};

/** The default light theme. Light half of `cobaltThemePair`. */
export const lightTheme: FieldTheme = {
  id: 'field-light',
  label: 'Architectural Light',
  mode: 'light',
  semantics: lightSemantics,
};
