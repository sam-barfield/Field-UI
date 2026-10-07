import { FieldTheme } from './types.js';

type Rgba = [r: number, g: number, b: number, a: number];

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()` colours. Returns `null` for anything else. */
export function parseColor(input: string): Rgba | null {
  const value = input.trim().toLowerCase();
  const hex = value.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const fn = value.match(/^rgba?\(([^)]+)\)$/);
  if (fn) {
    const raw = fn[1].split(/[\s,/]+/).filter(Boolean);
    if (raw.length < 3) return null;
    const channel = (p: string) => (p.endsWith('%') ? (parseFloat(p) / 100) * 255 : parseFloat(p));
    const alpha = raw[3] === undefined ? 1 : raw[3].endsWith('%') ? parseFloat(raw[3]) / 100 : parseFloat(raw[3]);
    const rgba = [channel(raw[0]), channel(raw[1]), channel(raw[2]), alpha] as Rgba;
    return rgba.some(Number.isNaN) ? null : rgba;
  }
  return null;
}

/** Composite a (possibly translucent) colour over an opaque background. */
function flatten(color: Rgba, background: Rgba): Rgba {
  const a = color[3];
  return [0, 1, 2].map(i => color[i] * a + background[i] * (1 - a)).concat(1) as Rgba;
}

function luminance([r, g, b]: Rgba): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG 2 contrast ratio between two colours (1 to 21). Translucent colours are composited:
 * the background over `canvas` (default white), then the foreground over the background.
 * Returns `NaN` if a colour cannot be parsed (e.g. `color-mix()` or a CSS variable).
 *
 * @example contrastRatio('#FFFFFF', '#D00000') // 5.7
 */
export function contrastRatio(foreground: string, background: string, canvas = '#FFFFFF'): number {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  const base = parseColor(canvas);
  if (!fg || !bg || !base) return NaN;
  const solidBg = flatten(bg, flatten(base, [255, 255, 255, 1]));
  const solidFg = flatten(fg, solidBg);
  const [hi, lo] = [luminance(solidFg), luminance(solidBg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastCheck {
  /** What is being checked, e.g. `"accent.text on surfaces.base"`. */
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  /** WCAG AA minimum: 4.5 for text, 3 for focus rings. */
  minimum: number;
  pass: boolean;
}

/**
 * Check the WCAG AA contrast of every text / surface pairing Field components rely on:
 * body text on surfaces, button text on the accent fill, accent text (links, active nav)
 * on surfaces, status text, and the focus ring. Unparseable colours are skipped.
 *
 * @example
 * checkThemeContrast(brandPair.dark).filter(c => !c.pass)
 */
export function checkThemeContrast(theme: FieldTheme): ContrastCheck[] {
  const s = theme.semantics;
  const base = s.surfaces.base;
  const accentText = s.accent.text ?? s.accent.primary;
  const surfaces: Array<[string, string]> = [
    ['surfaces.base', s.surfaces.base],
    ['surfaces.raised', s.surfaces.raised],
    ['surfaces.sunken', s.surfaces.sunken],
  ];
  const rows: Array<[string, string, string, number]> = [];
  for (const [name, bg] of surfaces) {
    rows.push([`text.primary on ${name}`, s.text.primary, bg, 4.5]);
    rows.push([`text.secondary on ${name}`, s.text.secondary, bg, 4.5]);
    rows.push([`text.tertiary on ${name}`, s.text.tertiary, bg, 4.5]);
    rows.push([`accent.text on ${name}`, accentText, bg, 4.5]);
  }
  rows.push(['accent.text on accent.subtle', accentText, s.accent.subtle, 4.5]);
  rows.push(['accent.contrast on accent.primary', s.accent.contrast, s.accent.primary, 4.5]);
  rows.push(['accent.contrast on accent.hover', s.accent.contrast, s.accent.hover, 4.5]);
  for (const status of ['success', 'warning', 'danger', 'info'] as const) {
    rows.push([`status.${status}.text on surfaces.base`, s.status[status].text, base, 4.5]);
    rows.push([`status.${status}.text on status.${status}.surface`, s.status[status].text, s.status[status].surface, 4.5]);
  }
  rows.push(['borders.focus on surfaces.base', s.borders.focus, base, 3]);

  return rows.flatMap(([label, foreground, background, minimum]) => {
    const ratio = contrastRatio(foreground, background, base);
    if (Number.isNaN(ratio)) return [];
    return [{ label, foreground, background, ratio, minimum, pass: ratio >= minimum }];
  });
}
