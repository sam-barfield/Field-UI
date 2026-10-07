import { contrastRatio, type FieldSemanticTokens } from '@sam.barfield/field-react';
import { adjustLightness, alphaOf, atLightness, bestContrastText, fixContrast, hsl, lightnessOf, mix, withAlpha } from './color';

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

/** Moves `fg` until it reaches `min` against every background (in order). */
function passOn(fg: string, backgrounds: string[], min: number, canvas: string): string {
  return backgrounds.reduce((color, bg) => fixContrast(color, bg, min, canvas) ?? color, fg);
}

/**
 * The colour between `fg` and `bg` that is as close to `bg` as possible while keeping `target`
 * contrast against it. Tiers built this way keep their spacing on any surface colour.
 */
function mixToContrast(fg: string, bg: string, target: number, canvas: string): string {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const t = (lo + hi) / 2;
    if (contrastRatio(mix(fg, bg, t), bg, canvas) >= target) lo = t;
    else hi = t;
  }
  return mix(fg, bg, lo);
}

/**
 * Re-derives one token group from its seed token (surfaces.base, text.primary, accent.primary,
 * borders.default or status.*.base), leaving every other group untouched.
 */
export function deriveGroup(groupId: string, semantics: FieldSemanticTokens, mode: Mode): FieldSemanticTokens {
  const s = structuredClone(semantics);
  const page = s.surfaces.base;
  const surfaces = [s.surfaces.base, s.surfaces.raised, s.surfaces.sunken];

  switch (groupId) {
    case 'surfaces': {
      const base = s.surfaces.base;
      const l = lightnessOf(base);
      const at = (delta: number) => atLightness(base, Math.min(100, Math.max(0, l + delta)));
      // Light themes: cards are white (or a step lighter), wells darker. Dark themes: every layer above the page is lighter.
      s.surfaces =
        mode === 'light'
          ? { base, raised: l >= 96 ? '#FFFFFF' : at(3), overlay: l >= 96 ? '#FFFFFF' : at(3), sunken: at(-4), subtle: at(-2.5), active: at(-8) }
          : { base, raised: at(3.5), overlay: at(6.5), sunken: at(-2), subtle: at(7.5), active: at(11.5) };
      break;
    }
    case 'text': {
      const primary = s.text.primary;
      s.text = {
        primary,
        // Targets against the page: about 7.5:1 and 5:1, then at least 4.5:1 on every surface.
        secondary: passOn(mixToContrast(primary, page, 7.5, page), surfaces, 4.5, page),
        tertiary: passOn(mixToContrast(primary, page, 5, page), surfaces, 4.5, page),
        inverse: page,
        disabled: mix(primary, page, 0.72),
      };
      break;
    }
    case 'accent':
      s.accent = deriveAccent(s.accent.primary, mode, s.surfaces);
      break;
    case 'borders': {
      const def = s.borders.default;
      const a = alphaOf(def);
      s.borders = {
        ...s.borders,
        // Translucent defaults scale their alpha; an opaque default mixes towards the page / text.
        subtle: a < 1 ? withAlpha(def, a * 0.55) : mix(def, page, 0.45),
        strong: a < 1 ? withAlpha(def, Math.min(1, a * 1.85)) : mix(def, s.text.primary, 0.3),
      };
      break;
    }
    default: {
      const status = groupId as keyof FieldSemanticTokens['status'];
      if (!(status in s.status)) break;
      const base = s.status[status].base;
      const surface = withAlpha(base, mode === 'light' ? 0.08 : 0.12);
      s.status[status] = {
        base,
        surface,
        border: withAlpha(base, mode === 'light' ? 0.22 : 0.3),
        // Text sits on the page and on its own tinted surface, so it must pass on both.
        text: passOn(adjustLightness(base, mode === 'light' ? -8 : 15), [page, surface], 4.5, page),
      };
    }
  }
  return s;
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
