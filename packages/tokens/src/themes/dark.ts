import { FieldSemanticTokens, FieldTheme } from '../types.js';

export const darkSemantics: FieldSemanticTokens = {
  name: 'Field Obsidian Dark',
  mode: 'dark',
  surfaces: {
    base: '#090B0E',
    raised: '#11141B',
    overlay: '#171B24',
    sunken: '#050608',
    subtle: '#1C212B',
    active: '#242A37',
  },
  borders: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    default: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.22)',
    focus: '#3B82F6',
    highlight: 'rgba(255, 255, 255, 0.14)',
  },
  text: {
    primary: '#F3F6FA',
    secondary: '#9BA3AF',
    tertiary: '#758092',
    inverse: '#090B0E',
    disabled: '#424A59',
  },
  accent: {
    primary: '#2563EB',
    // White text needs a deeper hover than the lighter #3B82F6 (3.7:1).
    hover: '#1B6EF5',
    active: '#1D4ED8',
    subtle: 'rgba(37, 99, 235, 0.14)',
    subtleHover: 'rgba(37, 99, 235, 0.22)',
    contrast: '#FFFFFF',
    // #2563EB is too dark to read as text on the near-black page; links use a lighter blue.
    text: '#487CEE',
  },
  status: {
    success: {
      base: '#10B981',
      surface: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34D399',
    },
    warning: {
      base: '#F59E0B',
      surface: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#FBBF24',
    },
    danger: {
      base: '#EF4444',
      surface: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#F87171',
    },
    info: {
      base: '#06B6D4',
      surface: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      text: '#22D3EE',
    },
  },
};

export const darkTheme: FieldTheme = {
  id: 'field-dark',
  label: 'Obsidian Dark (Default)',
  mode: 'dark',
  semantics: darkSemantics,
};
