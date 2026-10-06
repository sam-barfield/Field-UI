'use client';

import React, { useMemo } from 'react';
import { themeToCssVariables } from '@sam.barfield/field-tokens';
import { useThemeSafe } from './ThemeProvider.js';

/**
 * Props for the root element of anything rendered into a portal (modals,
 * tooltips, toasts, popovers).
 *
 * Portals escape the DOM subtree of a container-scoped `<ThemeProvider>` /
 * `<ThemeScope>`, so they would otherwise lose the theme's CSS variables.
 * When the nearest provider is container-scoped, the variables are inlined
 * onto the portal root; with root scope they are already on `<html>`.
 */
export function usePortalThemeProps(extraClassName = '', style?: React.CSSProperties) {
  const { theme, scope } = useThemeSafe();
  const vars = useMemo(
    () => (scope === 'container' ? (themeToCssVariables(theme) as React.CSSProperties) : undefined),
    [scope, theme]
  );

  return {
    className: `field-layer ${extraClassName}`.trim(),
    'data-field-theme': theme.id,
    'data-theme': theme.mode,
    style: vars || style ? { ...vars, ...style } : undefined,
  };
}

/** Resolve the element a portal should render into. */
export function getPortalTarget(container?: HTMLElement | null): HTMLElement | null {
  if (container) return container;
  return typeof document !== 'undefined' ? document.body : null;
}
