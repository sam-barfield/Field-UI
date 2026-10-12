import React from 'react';
import { FieldTheme, FieldThemePair } from '@sam.barfield/field-tokens';

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextValue {
  /** The active theme object. */
  theme: FieldTheme;
  /** Shortcut for `theme.mode`. */
  mode: ThemeMode;
  /** The dark/light pair the active theme belongs to, if any. */
  themePair?: FieldThemePair;
  /** Global router link component. Receives `href`; see `ThemeProviderProps.linkComponent`. */
  linkComponent?: React.ElementType;
  /** Where CSS variables are applied: `<html>` (`root`) or a wrapper element (`container`). */
  scope: 'root' | 'container';
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Switch to an arbitrary theme. */
  setTheme: (theme: FieldTheme) => void;
  /** Switch between the dark and light theme of the current pair. */
  setMode: (mode: ThemeMode) => void;
  /** Switch to another theme pair, keeping the current mode. */
  setThemePair: (pair: FieldThemePair) => void;
  /** Flip between dark and light. */
  toggleMode: () => void;
  /** Edit the active theme in place (used by the theme editor). */
  updateThemeSemantics: (updater: (prev: FieldTheme) => FieldTheme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Start with a specific theme instead of a pair. */
  initialTheme?: FieldTheme;
  /** Dark/light theme pair to use. Defaults to the built-in Obsidian / Cobalt pair. */
  themePair?: FieldThemePair;
  /**
   * Router link component used for internal `href`s by link-rendering components. It receives
   * `href` (never `to`): `next/link` works as is; for React Router or TanStack Router pass an
   * adapter that maps `href` to `to` (see the Routing guide).
   */
  linkComponent?: React.ElementType;
  /** Initial mode. `'system'` follows the OS `prefers-color-scheme` setting. Default `'dark'`. */
  defaultMode?: ThemeMode | 'system';
  /** When set, the chosen mode is saved to `localStorage` under this key and restored on load. */
  storageKey?: string;
  /** Write CSS variables to `<html>` when `scope="root"`. Default `true`. */
  injectGlobalStyles?: boolean;
  /** `root` themes the whole document; `container` themes only a wrapper element. Default `root`. */
  scope?: 'root' | 'container';
  /** Wrapper element type (container scope, or root scope with className/style). */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export interface ThemeScopeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children: React.ReactNode;
  /** Explicit theme for this subtree. */
  theme?: FieldTheme;
  /** Theme pair for this subtree (mode inherited unless `mode` is set). */
  themePair?: FieldThemePair;
  /** Force dark or light for this subtree, using the current pair. */
  mode?: ThemeMode;
  /** Merge theme attributes and variables directly onto the child element without creating a wrapper div. */
  asChild?: boolean;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}
