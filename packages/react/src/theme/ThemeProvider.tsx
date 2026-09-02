import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FieldTheme, darkTheme, lightTheme, themeToCssVariables } from '@sam.barfield/field-tokens';
import { ThemeContextValue, ThemeProviderProps } from './types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = darkTheme,
  defaultMode = 'dark',
  injectGlobalStyles = true,
}) => {
  const [theme, setTheme] = useState<FieldTheme>(initialTheme);
  const [mode, setMode] = useState<'dark' | 'light'>(defaultMode);

  // Sync mode changes with corresponding semantics
  const toggleMode = () => {
    const nextMode = theme.mode === 'dark' ? 'light' : 'dark';
    if (nextMode === 'light') {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  };

  const updateThemeSemantics = (updater: (prev: FieldTheme) => FieldTheme) => {
    setTheme((prev: FieldTheme) => updater(prev));
  };

  // Inject CSS variables directly into document head or root
  useEffect(() => {
    if (!injectGlobalStyles) return;

    const cssVars = themeToCssVariables(theme);
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val as string);
    });

    root.setAttribute('data-field-theme', theme.id);
    root.setAttribute('data-theme', theme.mode);
    root.style.colorScheme = theme.mode;
  }, [theme, injectGlobalStyles]);

  const value = useMemo(
    () => ({
      theme,
      mode: theme.mode,
      setTheme,
      setMode: (m: 'dark' | 'light') => {
        if (m === theme.mode) return;
        setTheme(m === 'light' ? lightTheme : darkTheme);
      },
      toggleMode,
      updateThemeSemantics,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a Field <ThemeProvider>');
  }
  return context;
};
