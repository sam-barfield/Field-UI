import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  FieldTheme,
  FieldThemePair,
  darkTheme,
  lightTheme,
  themeToCssVariables,
  themePairs,
  cobaltThemePair,
} from '@sam.barfield/field-tokens';
import { ThemeContextValue, ThemeProviderProps } from './types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolvePairForTheme(theme: FieldTheme, explicitPair?: FieldThemePair): FieldThemePair | undefined {
  if (explicitPair) return explicitPair;
  return themePairs.find(
    pair => pair.dark.id === theme.id || pair.light.id === theme.id || pair.id === theme.id
  );
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  themePair,
  defaultMode = 'dark',
  injectGlobalStyles = true,
}) => {
  const [currentPair, setCurrentPair] = useState<FieldThemePair | undefined>(() => {
    if (themePair) return themePair;
    if (initialTheme) return resolvePairForTheme(initialTheme);
    return cobaltThemePair;
  });

  const [theme, setThemeState] = useState<FieldTheme>(() => {
    if (themePair) return themePair[defaultMode] || (defaultMode === 'dark' ? themePair.dark : themePair.light);
    if (initialTheme) return initialTheme;
    return defaultMode === 'dark' ? darkTheme : lightTheme;
  });

  const [mode, setModeState] = useState<'dark' | 'light'>(theme.mode || defaultMode);

  // Synchronize state if themePair or initialTheme prop changes
  useEffect(() => {
    if (themePair) {
      setCurrentPair(themePair);
      setThemeState(prev => (prev.mode === 'light' ? themePair.light : themePair.dark));
    }
  }, [themePair]);

  const setTheme = useCallback((newTheme: FieldTheme) => {
    setThemeState(newTheme);
    setModeState(newTheme.mode);
    const matched = resolvePairForTheme(newTheme);
    if (matched) {
      setCurrentPair(matched);
    }
  }, []);

  const setThemePair = useCallback(
    (pair: FieldThemePair) => {
      setCurrentPair(pair);
      setThemeState(prev => (prev.mode === 'light' ? pair.light : pair.dark));
    },
    []
  );

  const setMode = useCallback(
    (targetMode: 'dark' | 'light') => {
      setModeState(targetMode);
      if (currentPair) {
        setThemeState(targetMode === 'light' ? currentPair.light : currentPair.dark);
      } else {
        setThemeState(targetMode === 'light' ? lightTheme : darkTheme);
      }
    },
    [currentPair]
  );

  // Sync mode changes with corresponding semantics without erasing custom themes
  const toggleMode = useCallback(() => {
    const nextMode = theme.mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  }, [theme.mode, setMode]);

  const updateThemeSemantics = useCallback((updater: (prev: FieldTheme) => FieldTheme) => {
    setThemeState(prev => updater(prev));
  }, []);

  // Inject CSS variables directly into document head or root
  useEffect(() => {
    if (!injectGlobalStyles || typeof document === 'undefined') return;

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
      themePair: currentPair,
      setTheme,
      setThemePair,
      setMode,
      toggleMode,
      updateThemeSemantics,
    }),
    [theme, currentPair, setTheme, setThemePair, setMode, toggleMode, updateThemeSemantics]
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
