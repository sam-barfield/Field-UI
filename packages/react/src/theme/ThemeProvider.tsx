'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FieldTheme,
  FieldThemePair,
  darkTheme,
  lightTheme,
  themeToCssVariables,
  themePairs,
  cobaltThemePair,
} from '@sam.barfield/field-tokens';
import { ThemeContextValue, ThemeMode, ThemeProviderProps, ThemeScopeProps } from './types.js';
import { useIsomorphicLayoutEffect } from '../utils/hooks.js';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolvePairForTheme(theme: FieldTheme, explicitPair?: FieldThemePair): FieldThemePair | undefined {
  if (explicitPair) return explicitPair;
  return themePairs.find(
    pair => pair.dark.id === theme.id || pair.light.id === theme.id || pair.id === theme.id
  );
}

function readStoredMode(storageKey?: string): ThemeMode | undefined {
  if (!storageKey || typeof window === 'undefined') return undefined;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : undefined;
  } catch {
    return undefined;
  }
}

function resolveInitialMode(defaultMode: ThemeProviderProps['defaultMode'], storageKey?: string): ThemeMode {
  const stored = readStoredMode(storageKey);
  if (stored) return stored;
  if (defaultMode === 'system') {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  }
  return defaultMode ?? 'dark';
}

/**
 * Provides the active Field theme to every component below it.
 *
 * With `scope="root"` (default) the theme's CSS variables are written to
 * `<html>`, so the whole page (including portals) is themed. With
 * `scope="container"` they are applied to a wrapper element instead, which
 * lets you render several themes side by side.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  themePair,
  defaultMode = 'dark',
  storageKey,
  injectGlobalStyles = true,
  scope = 'root',
  as: Component = 'div',
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const [currentPair, setCurrentPair] = useState<FieldThemePair | undefined>(() => {
    if (themePair) return themePair;
    if (initialTheme) return resolvePairForTheme(initialTheme);
    return cobaltThemePair;
  });

  const [theme, setTheme] = useState<FieldTheme>(() => {
    if (initialTheme && !themePair) return initialTheme;
    const mode = resolveInitialMode(defaultMode, storageKey);
    const pair = themePair ?? cobaltThemePair;
    return mode === 'light' ? pair.light : pair.dark;
  });

  // Synchronize state if the themePair prop changes
  useEffect(() => {
    if (themePair) {
      setCurrentPair(themePair);
      setTheme(prev => (prev.mode === 'light' ? themePair.light : themePair.dark));
    }
  }, [themePair]);

  // Persist the chosen mode
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, theme.mode);
    } catch {
      /* storage unavailable (private mode, quota) - ignore */
    }
  }, [storageKey, theme.mode]);

  const setThemeCallback = useCallback((newTheme: FieldTheme) => {
    setTheme(newTheme);
    const matched = resolvePairForTheme(newTheme);
    if (matched) {
      setCurrentPair(matched);
    }
  }, []);

  const setThemePair = useCallback((pair: FieldThemePair) => {
    setCurrentPair(pair);
    setTheme(prev => (prev.mode === 'light' ? pair.light : pair.dark));
  }, []);

  const setMode = useCallback(
    (targetMode: ThemeMode) => {
      if (currentPair) {
        setTheme(targetMode === 'light' ? currentPair.light : currentPair.dark);
      } else {
        setTheme(targetMode === 'light' ? lightTheme : darkTheme);
      }
    },
    [currentPair]
  );

  const toggleMode = useCallback(() => {
    setMode(theme.mode === 'dark' ? 'light' : 'dark');
  }, [theme.mode, setMode]);

  const updateThemeSemantics = useCallback((updater: (prev: FieldTheme) => FieldTheme) => {
    setTheme(prev => updater(prev));
  }, []);

  const cssVars = useMemo(() => themeToCssVariables(theme), [theme]);

  // Root scope: write variables to <html> before paint to avoid a flash of the default theme.
  useIsomorphicLayoutEffect(() => {
    if (scope !== 'root' || !injectGlobalStyles || typeof document === 'undefined') return;

    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    root.dataset.fieldTheme = theme.id;
    root.dataset.theme = theme.mode;
    root.style.colorScheme = theme.mode;

    return () => {
      Object.keys(cssVars).forEach(key => {
        root.style.removeProperty(key);
      });
      delete root.dataset.fieldTheme;
      delete root.dataset.theme;
      root.style.colorScheme = '';
    };
  }, [theme, injectGlobalStyles, scope, cssVars]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      mode: theme.mode,
      themePair: currentPair,
      scope,
      containerRef,
      setTheme: setThemeCallback,
      setThemePair,
      setMode,
      toggleMode,
      updateThemeSemantics,
    }),
    [theme, currentPair, scope, setThemeCallback, setThemePair, setMode, toggleMode, updateThemeSemantics]
  );

  if (scope === 'container') {
    return (
      <ThemeContext.Provider value={value}>
        <Component
          ref={containerRef}
          className={`field-scope ${className}`.trim()}
          data-field-theme={theme.id}
          data-theme={theme.mode}
          style={{
            ...cssVars,
            ...style,
          }}
        >
          {children}
        </Component>
      </ThemeContext.Provider>
    );
  }

  // Root scope with explicit wrapper element/classes/styles
  if (className || style || Component !== 'div') {
    return (
      <ThemeContext.Provider value={value}>
        <Component ref={containerRef} className={className} style={style}>
          {children}
        </Component>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const noop = () => {};

/**
 * Applies a different theme (or mode) to a subtree, e.g. a light card inside
 * a dark page. Components inside - including portals such as tooltips and
 * modals opened from within - use the scoped theme.
 */
export const ThemeScope: React.FC<ThemeScopeProps> = ({
  children,
  theme: explicitTheme,
  themePair: explicitPair,
  mode: explicitMode,
  as: Component = 'div',
  className = '',
  style,
  ...rest
}) => {
  const outerContext = useContext(ThemeContext);
  const containerRef = useRef<HTMLElement | null>(null);

  const resolvedTheme = useMemo(() => {
    if (explicitTheme) return explicitTheme;
    if (explicitPair) {
      const targetMode = explicitMode || outerContext?.mode || 'dark';
      return targetMode === 'light' ? explicitPair.light : explicitPair.dark;
    }
    const pair = outerContext?.themePair ?? cobaltThemePair;
    if (explicitMode) return explicitMode === 'light' ? pair.light : pair.dark;
    return outerContext?.theme || cobaltThemePair.dark;
  }, [explicitTheme, explicitPair, explicitMode, outerContext]);

  const cssVars = useMemo(() => themeToCssVariables(resolvedTheme), [resolvedTheme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme: resolvedTheme,
      mode: resolvedTheme.mode,
      themePair: explicitPair ?? outerContext?.themePair,
      scope: 'container',
      containerRef,
      setTheme: outerContext?.setTheme ?? noop,
      setMode: outerContext?.setMode ?? noop,
      setThemePair: outerContext?.setThemePair ?? noop,
      toggleMode: outerContext?.toggleMode ?? noop,
      updateThemeSemantics: outerContext?.updateThemeSemantics ?? noop,
    }),
    [resolvedTheme, explicitPair, outerContext]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Component
        {...rest}
        ref={containerRef}
        className={`field-scope ${className}`.trim()}
        data-field-theme={resolvedTheme.id}
        data-theme={resolvedTheme.mode}
        style={{
          ...cssVars,
          ...style,
        }}
      >
        {children}
      </Component>
    </ThemeContext.Provider>
  );
};

const fallbackContext: ThemeContextValue = {
  theme: cobaltThemePair.dark,
  mode: 'dark',
  themePair: cobaltThemePair,
  scope: 'root',
  setTheme: noop,
  setMode: noop,
  setThemePair: noop,
  toggleMode: noop,
  updateThemeSemantics: noop,
};

/**
 * Like `useTheme`, but returns the default dark theme (with no-op setters)
 * instead of throwing when used outside a `<ThemeProvider>`.
 */
export const useThemeSafe = (): ThemeContextValue => {
  return useContext(ThemeContext) ?? fallbackContext;
};

/** Access and control the active theme. Must be used inside `<ThemeProvider>`. */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a Field <ThemeProvider>');
  }
  return context;
};
