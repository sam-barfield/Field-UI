import { FieldTheme } from './types';
import { spacing } from './primitives/spacing';
import { radii } from './primitives/radii';
import { typography } from './primitives/typography';
import { shadows } from './primitives/shadows';
import { motion } from './primitives/motion';

/**
 * Generate CSS variable key-value pairs for a FieldTheme.
 */
export function themeToCssVariables(theme: FieldTheme): Record<string, string> {
  const activeRadii = { ...radii, ...(theme.radiiOverrides || {}) };

  const vars: Record<string, string> = {
    // Surfaces
    '--field-surface-base': theme.semantics.surfaces.base,
    '--field-surface-raised': theme.semantics.surfaces.raised,
    '--field-surface-overlay': theme.semantics.surfaces.overlay,
    '--field-surface-sunken': theme.semantics.surfaces.sunken,
    '--field-surface-subtle': theme.semantics.surfaces.subtle,
    '--field-surface-active': theme.semantics.surfaces.active,

    // Borders
    '--field-border-subtle': theme.semantics.borders.subtle,
    '--field-border-default': theme.semantics.borders.default,
    '--field-border-strong': theme.semantics.borders.strong,
    '--field-border-focus': theme.semantics.borders.focus,
    '--field-border-highlight': theme.semantics.borders.highlight,

    // Text
    '--field-text-primary': theme.semantics.text.primary,
    '--field-text-secondary': theme.semantics.text.secondary,
    '--field-text-tertiary': theme.semantics.text.tertiary,
    '--field-text-inverse': theme.semantics.text.inverse,
    '--field-text-disabled': theme.semantics.text.disabled,

    // Accent
    '--field-accent-primary': theme.semantics.accent.primary,
    '--field-accent-hover': theme.semantics.accent.hover,
    '--field-accent-active': theme.semantics.accent.active,
    '--field-accent-subtle': theme.semantics.accent.subtle,
    '--field-accent-subtle-hover': theme.semantics.accent.subtleHover,
    '--field-accent-contrast': theme.semantics.accent.contrast,

    // Status: Success
    '--field-status-success-base': theme.semantics.status.success.base,
    '--field-status-success-surface': theme.semantics.status.success.surface,
    '--field-status-success-border': theme.semantics.status.success.border,
    '--field-status-success-text': theme.semantics.status.success.text,

    // Status: Warning
    '--field-status-warning-base': theme.semantics.status.warning.base,
    '--field-status-warning-surface': theme.semantics.status.warning.surface,
    '--field-status-warning-border': theme.semantics.status.warning.border,
    '--field-status-warning-text': theme.semantics.status.warning.text,

    // Status: Danger
    '--field-status-danger-base': theme.semantics.status.danger.base,
    '--field-status-danger-surface': theme.semantics.status.danger.surface,
    '--field-status-danger-border': theme.semantics.status.danger.border,
    '--field-status-danger-text': theme.semantics.status.danger.text,

    // Status: Info
    '--field-status-info-base': theme.semantics.status.info.base,
    '--field-status-info-surface': theme.semantics.status.info.surface,
    '--field-status-info-border': theme.semantics.status.info.border,
    '--field-status-info-text': theme.semantics.status.info.text,

    // Radii
    '--field-radius-none': activeRadii.none,
    '--field-radius-xs': activeRadii.xs,
    '--field-radius-sm': activeRadii.sm,
    '--field-radius-md': activeRadii.md,
    '--field-radius-lg': activeRadii.lg,
    '--field-radius-xl': activeRadii.xl,
    '--field-radius-full': activeRadii.full,

    // Shadows
    '--field-shadow-none': shadows.none,
    '--field-shadow-xs': shadows.xs,
    '--field-shadow-sm': shadows.sm,
    '--field-shadow-md': shadows.md,
    '--field-shadow-lg': shadows.lg,
    '--field-shadow-xl': shadows.xl,
    '--field-shadow-glow': shadows.glow,

    // Fonts
    '--field-font-sans': typography.fonts.sans,
    '--field-font-mono': typography.fonts.mono,
    '--field-font-display': typography.fonts.display,

    // Transitions & Easings
    '--field-duration-instant': motion.durations.instant,
    '--field-duration-fast': motion.durations.fast,
    '--field-duration-normal': motion.durations.normal,
    '--field-duration-deliberate': motion.durations.deliberate,
    '--field-ease-default': motion.easings.default,
    '--field-ease-spring': motion.easings.spring,
  };

  // Add spacing variables
  Object.entries(spacing).forEach(([key, val]) => {
    vars[`--field-space-${key.replace('.', '_')}`] = val;
  });

  return vars;
}

/**
 * Render variables into a CSS stylesheet string.
 */
export function themeToCssString(theme: FieldTheme, selector = ':root'): string {
  const vars = themeToCssVariables(theme);
  const lines = Object.entries(vars).map(([prop, val]) => `  ${prop}: ${val};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

/**
 * Export theme as W3C DTCG-compliant Design Tokens JSON.
 */
export function themeToDtcgJson(theme: FieldTheme): string {
  const dtcgObj: Record<string, any> = {
    $description: `Field Design Tokens - ${theme.label}`,
    color: {
      surface: {
        base: { $value: theme.semantics.surfaces.base, $type: 'color' },
        raised: { $value: theme.semantics.surfaces.raised, $type: 'color' },
        overlay: { $value: theme.semantics.surfaces.overlay, $type: 'color' },
        sunken: { $value: theme.semantics.surfaces.sunken, $type: 'color' },
        subtle: { $value: theme.semantics.surfaces.subtle, $type: 'color' },
      },
      border: {
        subtle: { $value: theme.semantics.borders.subtle, $type: 'color' },
        default: { $value: theme.semantics.borders.default, $type: 'color' },
        strong: { $value: theme.semantics.borders.strong, $type: 'color' },
        focus: { $value: theme.semantics.borders.focus, $type: 'color' },
      },
      text: {
        primary: { $value: theme.semantics.text.primary, $type: 'color' },
        secondary: { $value: theme.semantics.text.secondary, $type: 'color' },
        tertiary: { $value: theme.semantics.text.tertiary, $type: 'color' },
        inverse: { $value: theme.semantics.text.inverse, $type: 'color' },
      },
      accent: {
        primary: { $value: theme.semantics.accent.primary, $type: 'color' },
        hover: { $value: theme.semantics.accent.hover, $type: 'color' },
        active: { $value: theme.semantics.accent.active, $type: 'color' },
      },
      status: theme.semantics.status,
    },
    radii: radii,
    spacing: spacing,
  };
  return JSON.stringify(dtcgObj, null, 2);
}

/**
 * Export theme as TypeScript config object.
 */
export function themeToTypeScript(theme: FieldTheme): string {
  return `import { FieldTheme } from '@field/tokens';

export const customFieldTheme: FieldTheme = ${JSON.stringify(theme, null, 2)};
`;
}
