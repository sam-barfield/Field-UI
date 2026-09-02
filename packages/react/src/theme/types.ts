import React from 'react';
import { FieldTheme } from '@field/tokens';

export interface ThemeContextValue {
  theme: FieldTheme;
  mode: 'dark' | 'light';
  setTheme: (theme: FieldTheme) => void;
  setMode: (mode: 'dark' | 'light') => void;
  toggleMode: () => void;
  updateThemeSemantics: (updater: (prev: FieldTheme) => FieldTheme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: FieldTheme;
  defaultMode?: 'dark' | 'light';
  injectGlobalStyles?: boolean;
}
