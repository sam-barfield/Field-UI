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
import { ThemeContextValue, ThemeProviderProps, ThemeScopeProps } from './types';

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
    if (themePair) return themePair[defaultMode] || (defaultMode === 'dark' ? themePair.dark : themePair.light);
    if (initialTheme) return initialTheme;
    return defaultMode === 'dark' ? darkTheme : lightTheme;
  });

  // Synchronize state if themePair prop changes
  useEffect(() => {
    if (themePair) {
      setCurrentPair(themePair);
      setTheme(prev => (prev.mode === 'light' ? themePair.light : themePair.dark));
    }
  }, [themePair]);

  const setThemeCallback = useCallback((newTheme: FieldTheme) => {
    setTheme(newTheme);
    const matched = resolvePairForTheme(newTheme);
    if (matched) {
      setCurrentPair(matched);
    }
  }, []);

  const setThemePair = useCallback(
    (pair: FieldThemePair) => {
      setCurrentPair(pair);
      setTheme(prev => (prev.mode === 'light' ? pair.light : pair.dark));
    },
    []
  );

  const setMode = useCallback(
    (targetMode: 'dark' | 'light') => {
      if (currentPair) {
        setTheme(targetMode === 'light' ? currentPair.light : currentPair.dark);
      } else {
        setTheme(targetMode === 'light' ? lightTheme : darkTheme);
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
    setTheme(prev => updater(prev));
  }, []);

  // Compute CSS variables for container scoping or root injection
  const cssVars = useMemo(() => themeToCssVariables(theme), [theme]);

  // Inject CSS variables into documentElement when scope === 'root' and injectGlobalStyles is true
  useEffect(() => {
    if (scope !== 'root' || !injectGlobalStyles || typeof document === 'undefined') return;

    const root = document.documentElement;

    Object.entries(cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val as string);
    });

    root.dataset.fieldTheme = theme.id;
    root.dataset.theme = theme.mode;
    root.style.colorScheme = theme.mode;

    // Cleanup on unmount or theme switch: remove all injected properties and attributes
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
    [theme, currentPair, scope, setTheme, setThemePair, setMode, toggleMode, updateThemeSemantics]
  );

  if (scope === 'container') {
    return (
      <ThemeContext.Provider value={value}>
        <Component
          ref={containerRef as any}
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

  // If scope is 'root' but explicit wrapper classes/styles/element were provided
  if (className || style || Component !== 'div') {
    return (
      <ThemeContext.Provider value={value}>
        <Component ref={containerRef as any} className={className} style={style}>
          {children}
        </Component>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * <ThemeScope> — Standalone container primitive for applying scoped theme boundaries.
 */
export const ThemeScope: React.FC<ThemeScopeProps> = ({
  children,
  theme: explicitTheme,
  themePair: explicitPair,
  mode: explicitMode,
  as: Component = 'div',
  className = '',
  style,
}) => {
  const outerContext = useContext(ThemeContext);

  const resolvedTheme = useMemo(() => {
    if (explicitTheme) return explicitTheme;
    if (explicitPair) {
      const targetMode = explicitMode || outerContext?.mode || 'dark';
      return targetMode === 'light' ? explicitPair.light : explicitPair.dark;
    }
    if (explicitMode && outerContext?.themePair) {
      return explicitMode === 'light' ? outerContext.themePair.light : outerContext.themePair.dark;
    }
    return outerContext?.theme || cobaltThemePair.dark;
  }, [explicitTheme, explicitPair, explicitMode, outerContext]);

  const cssVars = useMemo(() => themeToCssVariables(resolvedTheme), [resolvedTheme]);

  return (
    <Component
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
  );
};

/**
 * Safe version of useTheme that provides fallback theme values instead of throwing
 * when called outside of a Field <ThemeProvider>.
 */
export const useThemeSafe = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: cobaltThemePair.dark,
      mode: 'dark',
      themePair: cobaltThemePair,
      scope: 'root',
      setTheme: () => {},
      setMode: () => {},
      setThemePair: () => {},
      toggleMode: () => {},
      updateThemeSemantics: () => {},
    };
  }
  return context;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a Field <ThemeProvider>');
  }
  return context;
};
