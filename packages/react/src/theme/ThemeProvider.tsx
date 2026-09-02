import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FieldTheme, darkTheme, lightTheme, themeToCssVariables } from '@field/tokens';
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
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    if (nextMode === 'light' && theme.mode === 'dark') {
      setTheme(lightTheme);
    } else if (nextMode === 'dark' && theme.mode === 'light') {
      setTheme(darkTheme);
    }
  };

  const updateThemeSemantics = (updater: (prev: FieldTheme) => FieldTheme) => {
    setTheme(prev => updater(prev));
  };

  // Inject CSS variables directly into document head or root
  useEffect(() => {
    if (!injectGlobalStyles) return;

    const cssVars = themeToCssVariables(theme);
    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
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
        setMode(m);
        if (m === 'light') setTheme(lightTheme);
        else setTheme(darkTheme);
      },
      toggleMode,
      updateThemeSemantics,
    }),
    [theme, mode]
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
