import React from 'react';
import { FieldTheme, FieldThemePair } from '@sam.barfield/field-tokens';

export interface ThemeContextValue {
  theme: FieldTheme;
  mode: 'dark' | 'light';
  themePair?: FieldThemePair;
  scope: 'root' | 'container';
  containerRef?: React.RefObject<HTMLElement | null>;
  setTheme: (theme: FieldTheme) => void;
  setMode: (mode: 'dark' | 'light') => void;
  setThemePair: (pair: FieldThemePair) => void;
  toggleMode: () => void;
  updateThemeSemantics: (updater: (prev: FieldTheme) => FieldTheme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: FieldTheme;
  themePair?: FieldThemePair;
  defaultMode?: 'dark' | 'light';
  injectGlobalStyles?: boolean;
  scope?: 'root' | 'container';
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export interface ThemeScopeProps {
  children: React.ReactNode;
  theme?: FieldTheme;
  themePair?: FieldThemePair;
  mode?: 'dark' | 'light';
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}
