import { contrastRatio, parseColor } from '@sam.barfield/field-react';

/* Colour helpers for the theme builder. All inputs accept any colour parseColor understands
   (#rgb, #rrggbb, #rrggbbaa, rgb(), rgba()); outputs are uppercase #RRGGBB or rgba(). */

type Hsl = { h: number; s: number; l: number };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const hex2 = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0').toUpperCase();

export function isColor(value: string | undefined): value is string {
  return !!value && parseColor(value) !== null;
}

/** Opaque `#RRGGBB` (alpha dropped), for `<input type="color">`. */
export function toHex(color: string): string {
  const c = parseColor(color);
  return c ? `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}` : '#000000';
}

export function alphaOf(color: string): number {
  return parseColor(color)?.[3] ?? 1;
}

/** `rgba(r, g, b, a)` from any colour, or `#RRGGBB` when fully opaque. */
export function withAlpha(color: string, alpha: number): string {
  const c = parseColor(color);
  if (!c) return color;
  const a = Math.round(clamp(alpha, 0, 1) * 100) / 100;
  return a >= 1 ? toHex(color) : `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${a})`;
}

function toHsl(color: string): Hsl {
  const [r, g, b] = (parseColor(color) ?? [0, 0, 0, 1]).map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return { h: 0, s: 0, l: l * 100 };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

export function hsl(h: number, s: number, l: number): string {
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return `#${hex2((r + m) * 255)}${hex2((g + m) * 255)}${hex2((b + m) * 255)}`;
}

/** Shift lightness by `delta` percentage points, keeping hue, saturation and alpha. */
export function adjustLightness(color: string, delta: number): string {
  const { h, s, l } = toHsl(color);
  return withAlpha(hsl(h, s, l + delta), alphaOf(color));
}

/** The same colour with its hue rotated by `degrees` (saturation, lightness and alpha kept). */
export function rotateHue(color: string, degrees: number): string {
  const { h, s, l } = toHsl(color);
  return withAlpha(hsl((h + degrees + 360) % 360, s, l), alphaOf(color));
}

/**
 * Hue distance in degrees between two colours, or null when either is close to grey
 * (hue is meaningless there). Used to keep error colours distinct from the brand.
 */
export function hueGap(a: string, b: string): number | null {
  const ha = toHsl(a);
  const hb = toHsl(b);
  if (ha.s < 12 || hb.s < 12) return null;
  const d = Math.abs(ha.h - hb.h);
  return Math.min(d, 360 - d);
}

/**
 * The closest colour to `fg` (same hue and saturation, lightness moved as little as possible)
 * that reaches `min` contrast against `bg`. Returns `null` when no lightness gets there.
 */
export function fixContrast(fg: string, bg: string, min: number, canvas = '#FFFFFF'): string | null {
  if (contrastRatio(fg, bg, canvas) >= min) return fg;
  const { h, s, l } = toHsl(fg);
  const target = min + 0.05; // a little headroom so rounding never shows 4.49
  let best: string | null = null;
  let bestDelta = Infinity;
  for (const direction of [-1, 1]) {
    for (let step = 0.5; step <= 100; step += 0.5) {
      const lightness = l + direction * step;
      if (lightness < 0 || lightness > 100) break;
      const candidate = withAlpha(hsl(h, s, lightness), alphaOf(fg));
      if (contrastRatio(candidate, bg, canvas) >= target) {
        if (step < bestDelta) {
          best = candidate;
          bestDelta = step;
        }
        break;
      }
    }
  }
  return best;
}

/** White or near-black, whichever reads better on `fill`. */
export function bestContrastText(fill: string): string {
  return contrastRatio('#FFFFFF', fill) >= contrastRatio('#0B0B0F', fill) ? '#FFFFFF' : '#0B0B0F';
}
