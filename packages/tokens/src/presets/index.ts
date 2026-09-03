import { FieldTheme, FieldThemePair } from '../types';
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

export const titaniumAmberLightTheme: FieldTheme = {
  id: 'field-titanium-amber-light',
  label: 'Titanium Amber Light',
  mode: 'light',
  semantics: {
    name: 'Titanium Amber Light',
    mode: 'light',
    surfaces: {
      base: '#FAF8F5',
      raised: '#FFFFFF',
      overlay: '#FFFFFF',
      sunken: '#F3EFEA',
      subtle: '#F6F2EC',
      active: '#EBE5DC',
    },
    borders: {
      subtle: 'rgba(120, 53, 15, 0.07)',
      default: 'rgba(120, 53, 15, 0.15)',
      strong: 'rgba(120, 53, 15, 0.28)',
      focus: '#D97706',
      highlight: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
      primary: '#1C1917',
      secondary: '#57534E',
      tertiary: '#78716C',
      inverse: '#FAF8F5',
      disabled: '#A8A29E',
    },
    accent: {
      primary: '#D97706',
      hover: '#B45309',
      active: '#92400E',
      subtle: 'rgba(217, 119, 6, 0.1)',
      subtleHover: 'rgba(217, 119, 6, 0.18)',
      contrast: '#FFFFFF',
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
        text: '#B45309',
      },
      danger: {
        base: '#DC2626',
        surface: 'rgba(220, 38, 38, 0.08)',
        border: 'rgba(220, 38, 38, 0.2)',
        text: '#B91C1C',
      },
      info: {
        base: '#D97706',
        surface: 'rgba(217, 119, 6, 0.08)',
        border: 'rgba(217, 119, 6, 0.2)',
        text: '#B45309',
      },
    },
  },
  radiiOverrides: {
    sm: '3px',
    md: '5px',
    lg: '8px',
  },
};

export const emeraldPrecisionLightTheme: FieldTheme = {
  id: 'field-emerald-precision-light',
  label: 'Emerald Precision Light',
  mode: 'light',
  semantics: {
    name: 'Emerald Precision Light',
    mode: 'light',
    surfaces: {
      base: '#F4FBF7',
      raised: '#FFFFFF',
      overlay: '#FFFFFF',
      sunken: '#E6F4ED',
      subtle: '#EDF8F2',
      active: '#DCF0E5',
    },
    borders: {
      subtle: 'rgba(6, 78, 59, 0.07)',
      default: 'rgba(6, 78, 59, 0.15)',
      strong: 'rgba(6, 78, 59, 0.28)',
      focus: '#059669',
      highlight: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
      primary: '#06281E',
      secondary: '#064E3B',
      tertiary: '#047857',
      inverse: '#F4FBF7',
      disabled: '#6EE7B7',
    },
    accent: {
      primary: '#059669',
      hover: '#047857',
      active: '#065F46',
      subtle: 'rgba(5, 150, 105, 0.1)',
      subtleHover: 'rgba(5, 150, 105, 0.18)',
      contrast: '#FFFFFF',
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
        text: '#B45309',
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
  },
};

export const cobaltThemePair: FieldThemePair = {
  id: 'cobalt',
  label: 'Obsidian / Cobalt',
  dark: darkTheme,
  light: lightTheme,
};

export const titaniumAmberPair: FieldThemePair = {
  id: 'titanium-amber',
  label: 'Titanium Amber',
  dark: titaniumAmberTheme,
  light: titaniumAmberLightTheme,
};

export const emeraldPrecisionPair: FieldThemePair = {
  id: 'emerald-precision',
  label: 'Emerald Precision',
  dark: emeraldPrecisionTheme,
  light: emeraldPrecisionLightTheme,
};

export const defaultThemePair = cobaltThemePair;

export const themePairs: FieldThemePair[] = [
  cobaltThemePair,
  titaniumAmberPair,
  emeraldPrecisionPair,
];

export const themePresets: FieldTheme[] = [
  darkTheme,
  lightTheme,
  titaniumAmberTheme,
  titaniumAmberLightTheme,
  emeraldPrecisionTheme,
  emeraldPrecisionLightTheme,
  hyperVioletTheme,
  highContrastDarkTheme,
];

