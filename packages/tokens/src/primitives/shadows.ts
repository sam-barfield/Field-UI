/**
 * Elevation shadows tuned for dark surfaces: deep, dense drop shadows plus a
 * faint top highlight that reads as a bevel on near-black backgrounds.
 */
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  md: '0 4px 12px -2px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  lg: '0 12px 24px -4px rgba(0, 0, 0, 0.7), 0 4px 12px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  xl: '0 24px 48px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
  glow: '0 0 24px -4px var(--field-accent-primary)',
  /** Pressed / sunken controls, e.g. a button while it's held down. */
  inset: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.45)',
};

/**
 * Elevation shadows tuned for light surfaces. The dark-mode values above look
 * muddy on white, so light themes get softer, cooler shadows.
 */
export const lightShadows: typeof shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(15, 23, 42, 0.06)',
  sm: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)',
  md: '0 4px 12px -2px rgba(15, 23, 42, 0.1), 0 2px 6px -1px rgba(15, 23, 42, 0.06)',
  lg: '0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
  xl: '0 24px 48px -12px rgba(15, 23, 42, 0.22)',
  glow: '0 0 24px -4px var(--field-accent-primary)',
  inset: 'inset 0 1px 2px 0 rgba(15, 23, 42, 0.16)',
};
