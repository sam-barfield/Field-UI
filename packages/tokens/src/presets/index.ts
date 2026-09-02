import { FieldTheme } from '../types';
import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';
import { highContrastDarkTheme } from '../themes/high-contrast';

export const titaniumAmberTheme: FieldTheme = {
  id: 'field-titanium-amber',
  label: 'Titanium Amber (Tactical)',
  mode: 'dark',
  semantics: {
    name: 'Titanium Amber',
    mode: 'dark',
    surfaces: {
      base: '#0C0C0D',
      raised: '#151517',
      overlay: '#1B1B1E',
      sunken: '#070708',
      subtle: '#222226',
      active: '#2B2B31',
    },
    borders: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(255, 255, 255, 0.14)',
      strong: 'rgba(255, 255, 255, 0.24)',
      focus: '#F59E0B',
      highlight: 'rgba(245, 158, 11, 0.2)',
    },
    text: {
      primary: '#F5F5F7',
      secondary: '#A1A1AA',
      tertiary: '#71717A',
      inverse: '#0C0C0D',
      disabled: '#52525B',
    },
    accent: {
      primary: '#D97706',
      hover: '#F59E0B',
      active: '#B45309',
      subtle: 'rgba(245, 158, 11, 0.14)',
      subtleHover: 'rgba(245, 158, 11, 0.22)',
      contrast: '#000000',
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
        base: '#F59E0B',
        surface: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.25)',
        text: '#FCD34D',
      },
    },
  },
  radiiOverrides: {
    sm: '3px',
    md: '5px',
    lg: '8px',
  },
};

export const emeraldPrecisionTheme: FieldTheme = {
  id: 'field-emerald-precision',
  label: 'Emerald Precision (Cybernetic)',
  mode: 'dark',
  semantics: {
    name: 'Emerald Precision',
    mode: 'dark',
    surfaces: {
      base: '#070C0A',
      raised: '#0E1714',
      overlay: '#14211D',
      sunken: '#040706',
      subtle: '#1C2E28',
      active: '#243D35',
    },
    borders: {
      subtle: 'rgba(52, 211, 153, 0.1)',
      default: 'rgba(52, 211, 153, 0.18)',
      strong: 'rgba(52, 211, 153, 0.3)',
      focus: '#10B981',
      highlight: 'rgba(52, 211, 153, 0.25)',
    },
    text: {
      primary: '#ECFDF5',
      secondary: '#A7F3D0',
      tertiary: '#6EE7B7',
      inverse: '#070C0A',
      disabled: '#065F46',
    },
    accent: {
      primary: '#10B981',
      hover: '#34D399',
      active: '#059669',
      subtle: 'rgba(16, 185, 129, 0.14)',
      subtleHover: 'rgba(16, 185, 129, 0.24)',
      contrast: '#022C22',
    },
    status: {
      success: {
        base: '#10B981',
        surface: 'rgba(16, 185, 129, 0.14)',
        border: 'rgba(16, 185, 129, 0.28)',
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
  },
};

export const hyperVioletTheme: FieldTheme = {
  id: 'field-hyper-violet',
  label: 'Hyper Violet (Deep Space)',
  mode: 'dark',
  semantics: {
    name: 'Hyper Violet',
    mode: 'dark',
    surfaces: {
      base: '#090810',
      raised: '#12101E',
      overlay: '#1A172B',
      sunken: '#050409',
      subtle: '#231F3A',
      active: '#2E294D',
    },
    borders: {
      subtle: 'rgba(167, 139, 250, 0.1)',
      default: 'rgba(167, 139, 250, 0.18)',
      strong: 'rgba(167, 139, 250, 0.3)',
      focus: '#8B5CF6',
      highlight: 'rgba(167, 139, 250, 0.25)',
    },
    text: {
      primary: '#F5F3FF',
      secondary: '#C4B5FD',
      tertiary: '#8B5CF6',
      inverse: '#090810',
      disabled: '#5B21B6',
    },
    accent: {
      primary: '#7C3AED',
      hover: '#8B5CF6',
      active: '#6D28D9',
      subtle: 'rgba(124, 58, 237, 0.16)',
      subtleHover: 'rgba(124, 58, 237, 0.26)',
      contrast: '#FFFFFF',
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
        base: '#A78BFA',
        surface: 'rgba(167, 139, 250, 0.12)',
        border: 'rgba(167, 139, 250, 0.25)',
        text: '#C4B5FD',
      },
    },
  },
};

export const themePresets: FieldTheme[] = [
  darkTheme,
  lightTheme,
  titaniumAmberTheme,
  emeraldPrecisionTheme,
  hyperVioletTheme,
  highContrastDarkTheme,
];
