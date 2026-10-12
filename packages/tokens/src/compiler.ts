import { FieldTheme, FieldThemePair } from './types.js';
import { spacing } from './primitives/spacing.js';
import { radii } from './primitives/radii.js';
import { typography } from './primitives/typography.js';
import { shadows, lightShadows } from './primitives/shadows.js';
import { motion } from './primitives/motion.js';

/**
 * Generate CSS variable key-value pairs for a FieldTheme.
 *
 * Every `--field-*` custom property the component library reads is produced
 * here, so this is the single source of truth for the CSS variable contract.
 */
export function themeToCssVariables(theme: FieldTheme): Record<string, string> {
  const activeRadii = { ...radii, ...theme.radiiOverrides };
  const activeShadows = theme.mode === 'light' ? lightShadows : shadows;
  const activeFonts = { ...typography.fonts, ...theme.fonts };
  const headings = theme.typography ?? {};

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
    '--field-accent-border': theme.semantics.accent.subtleHover,
    '--field-accent-contrast': theme.semantics.accent.contrast,
    '--field-accent-text': theme.semantics.accent.text ?? theme.semantics.accent.primary,

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
    '--field-shadow-none': activeShadows.none,
    '--field-shadow-xs': activeShadows.xs,
    '--field-shadow-sm': activeShadows.sm,
    '--field-shadow-md': activeShadows.md,
    '--field-shadow-lg': activeShadows.lg,
    '--field-shadow-xl': activeShadows.xl,
    '--field-shadow-glow': activeShadows.glow,
    '--field-shadow-inset': activeShadows.inset,

    // Fonts
    '--field-font-sans': activeFonts.sans,
    '--field-font-mono': activeFonts.mono,
    '--field-font-display': activeFonts.display,

    // Headings
    '--field-heading-weight': String(headings.headingWeight ?? 600),
    '--field-display-weight': String(headings.displayWeight ?? 700),
    '--field-heading-tracking': String(headings.headingTracking ?? 1),
    '--field-heading-stretch': headings.headingStretch ?? 'normal',

    // Transitions & Easings
    '--field-duration-instant': motion.durations.instant,
    '--field-duration-fast': motion.durations.fast,
    '--field-duration-normal': motion.durations.normal,
    '--field-duration-deliberate': motion.durations.deliberate,
    '--field-ease-default': motion.easings.default,
    '--field-ease-in': motion.easings.in,
    '--field-ease-out': motion.easings.out,
    '--field-ease-in-out': motion.easings.inOut,
    '--field-ease-spring': motion.easings.spring,
  };

  // Buttons: only what the theme sets; field.css falls back to the defaults.
  const button = theme.button;
  if (button) {
    for (const group of ['height', 'paddingX', 'fontSize'] as const) {
      const prop = group === 'paddingX' ? 'padding-x' : group === 'fontSize' ? 'font-size' : 'height';
      Object.entries(button[group] ?? {}).forEach(([size, val]) => {
        if (val !== undefined) vars[`--field-btn-${prop}-${size}`] = val;
      });
    }
    const single: [string, string | number | undefined][] = [
      ['--field-btn-radius', button.radius],
      ['--field-btn-font-weight', button.fontWeight],
      ['--field-btn-letter-spacing', button.letterSpacing],
      ['--field-btn-text-transform', button.textTransform],
      ['--field-btn-shadow', button.shadow],
      ['--field-btn-shadow-hover', button.shadowHover],
      ['--field-btn-shadow-active', button.shadowActive],
      ['--field-btn-press-transform', button.pressTransform],
    ];
    single.forEach(([key, val]) => {
      if (val !== undefined) vars[key] = String(val);
    });
  }

  // Spacing: `0.5` becomes `--field-space-0_5` because `.` is not valid in a custom property name.
  Object.entries(spacing).forEach(([key, val]) => {
    vars[`--field-space-${key.replace('.', '_')}`] = val;
  });

  return vars;
}

/**
 * Render a theme's variables into a CSS rule.
 *
 * @example themeToCssString(darkTheme, ':root')
 */
export function themeToCssString(theme: FieldTheme, selector = ':root'): string {
  const vars = themeToCssVariables(theme);
  const lines = Object.entries(vars).map(([prop, val]) => `  ${prop}: ${val};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

/**
 * Render a complete stylesheet for a dark/light theme pair.
 *
 * The dark theme is the default on `:root`; `[data-theme="light"]` switches to
 * the light theme. This is what `@sam.barfield/field-react/styles.css` ships
 * with, so pages render with correct colours before React hydrates (no flash
 * of unstyled content, and SSR works without any JavaScript).
 */
export function themePairToCssString(pair: FieldThemePair): string {
  return [
    themeToCssString(pair.dark, ':root, [data-theme="dark"]:not(.field-layer)'),
    `:root, [data-theme="dark"]:not(.field-layer) {\n  color-scheme: dark;\n}\n`,
    themeToCssString(pair.light, '[data-theme="light"]:not(.field-layer)'),
    `[data-theme="light"]:not(.field-layer) {\n  color-scheme: light;\n}\n`,
  ].join('\n');
}

/**
 * Export theme as W3C DTCG-compliant Design Tokens JSON.
 */
export function themeToDtcgJson(theme: FieldTheme): string {
  const s = theme.semantics;
  const color = (value: string) => ({ $value: value, $type: 'color' });
  const statusGroup = (group: FieldTheme['semantics']['status']['success']) => ({
    base: color(group.base),
    surface: color(group.surface),
    border: color(group.border),
    text: color(group.text),
  });

  const dtcgObj = {
    $description: `Field Design Tokens - ${theme.label}`,
    color: {
      surface: {
        base: color(s.surfaces.base),
        raised: color(s.surfaces.raised),
        overlay: color(s.surfaces.overlay),
        sunken: color(s.surfaces.sunken),
        subtle: color(s.surfaces.subtle),
        active: color(s.surfaces.active),
      },
      border: {
        subtle: color(s.borders.subtle),
        default: color(s.borders.default),
        strong: color(s.borders.strong),
        focus: color(s.borders.focus),
        highlight: color(s.borders.highlight),
      },
      text: {
        primary: color(s.text.primary),
        secondary: color(s.text.secondary),
        tertiary: color(s.text.tertiary),
        inverse: color(s.text.inverse),
        disabled: color(s.text.disabled),
      },
      accent: {
        primary: color(s.accent.primary),
        hover: color(s.accent.hover),
        active: color(s.accent.active),
        subtle: color(s.accent.subtle),
        subtleHover: color(s.accent.subtleHover),
        contrast: color(s.accent.contrast),
        text: color(s.accent.text ?? s.accent.primary),
      },
      status: {
        success: statusGroup(s.status.success),
        warning: statusGroup(s.status.warning),
        danger: statusGroup(s.status.danger),
        info: statusGroup(s.status.info),
      },
    },
    radius: Object.fromEntries(
      Object.entries({ ...radii, ...theme.radiiOverrides }).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])
    ),
    spacing: Object.fromEntries(
      Object.entries(spacing).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])
    ),
  };
  return JSON.stringify(dtcgObj, null, 2);
}

/**
 * Export theme as a TypeScript module that can be dropped into a project.
 */
export function themeToTypeScript(theme: FieldTheme): string {
  return `import type { FieldTheme } from '@sam.barfield/field-tokens';

export const customFieldTheme: FieldTheme = ${JSON.stringify(theme, null, 2)};
`;
}
