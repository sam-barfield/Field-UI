import { contrastRatio, type FieldSemanticTokens } from '@sam.barfield/field-react';
import { adjustLightness, bestContrastText, fixContrast, hsl, withAlpha } from './color';

type Mode = 'light' | 'dark';
type Accent = FieldSemanticTokens['accent'];

/**
 * A full accent group from one brand colour: hover / active states, tints, the text colour
 * for buttons, and a separate `text` tint when the brand colour is not readable as text on
 * the page surfaces (common for reds, oranges and yellows in dark mode).
 */
export function deriveAccent(primary: string, mode: Mode, surfaces: FieldSemanticTokens['surfaces']): Accent {
  const contrast = bestContrastText(primary);
  // Dark mode hovers get lighter, light mode hovers get darker: both read as "more".
  // Either way the button text must stay readable on them.
  const keepReadable = (fill: string) => fixContrast(fill, contrast, Math.min(4.5, contrastRatio(contrast, primary))) ?? fill;
  const hover = keepReadable(adjustLightness(primary, mode === 'dark' ? 7 : -7));
  const active = keepReadable(adjustLightness(primary, mode === 'dark' ? -5 : -13));

  let text = primary;
  for (const bg of [surfaces.base, surfaces.raised, surfaces.sunken]) {
    text = fixContrast(text, bg, 4.5, surfaces.base) ?? text;
  }

  return {
    primary,
    hover,
    active,
    subtle: withAlpha(primary, mode === 'dark' ? 0.14 : 0.08),
    subtleHover: withAlpha(primary, mode === 'dark' ? 0.22 : 0.14),
    contrast,
    ...(text.toUpperCase() !== primary.toUpperCase() ? { text } : {}),
  };
}

/**
 * Neutral surfaces, text and borders tinted towards one hue. `tint` is the saturation in
 * percent (0 = pure grey, 10 = a noticeable cast). Text tiers are checked so they pass AA on
 * every surface they are likely to sit on.
 */
export function generateNeutrals(hue: number, tint: number, mode: Mode, focus: string) {
  const s = tint;
  const surfaces =
    mode === 'light'
      ? { base: hsl(hue, s, 98.5), raised: '#FFFFFF', overlay: '#FFFFFF', sunken: hsl(hue, s, 94.5), subtle: hsl(hue, s, 96), active: hsl(hue, s, 90.5) }
      : { base: hsl(hue, s, 4.5), raised: hsl(hue, s, 8), overlay: hsl(hue, s, 11), sunken: hsl(hue, s, 2.5), subtle: hsl(hue, s, 12), active: hsl(hue, s, 16) };

  const ink = mode === 'light' ? hsl(hue, s * 1.5, 10) : hsl(hue, s * 0.6, 95);
  const passOnAll = (color: string) =>
    [surfaces.base, surfaces.raised, surfaces.sunken].reduce((c, bg) => fixContrast(c, bg, 4.5) ?? c, color);

  const text = {
    primary: ink,
    secondary: passOnAll(mode === 'light' ? hsl(hue, s, 32) : hsl(hue, s, 74)),
    tertiary: passOnAll(mode === 'light' ? hsl(hue, s, 44) : hsl(hue, s, 60)),
    inverse: mode === 'light' ? surfaces.base : hsl(hue, s, 6),
    disabled: mode === 'light' ? hsl(hue, s, 76) : hsl(hue, s, 32),
  };

  const borders = {
    subtle: withAlpha(ink, mode === 'light' ? 0.07 : 0.08),
    default: withAlpha(ink, mode === 'light' ? 0.13 : 0.14),
    strong: withAlpha(ink, mode === 'light' ? 0.24 : 0.26),
    focus,
    highlight: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : withAlpha(ink, 0.06),
  };

  return { surfaces, text, borders };
}
