import { useCallback, useEffect, useRef, useState } from 'react';
import {
  checkThemeContrast,
  darkTheme,
  lightTheme,
  themePairs,
  type ContrastCheck,
  type FieldSemanticTokens,
  type FieldTheme,
  type FieldThemePair,
} from '@sam.barfield/field-react';

export type Mode = 'light' | 'dark';

/* ---------- Token paths ---------- */

export interface TokenGroup {
  id: string;
  title: string;
  hint: string;
  paths: string[];
}

const STATUSES = ['success', 'warning', 'danger', 'info'] as const;

export const TOKEN_GROUPS: TokenGroup[] = [
  { id: 'surfaces', title: 'Surfaces', hint: 'base is the page, raised is cards, overlay is menus and dialogs, sunken is inputs and wells.', paths: ['base', 'raised', 'overlay', 'sunken', 'subtle', 'active'].map(k => `surfaces.${k}`) },
  { id: 'text', title: 'Text', hint: 'primary for headings and body, secondary for supporting copy, tertiary for captions and meta. All three must pass 4.5:1.', paths: ['primary', 'secondary', 'tertiary', 'inverse', 'disabled'].map(k => `text.${k}`) },
  { id: 'accent', title: 'Accent', hint: 'primary is the button fill with contrast text on it. text is the accent as text (links, active nav); leave it empty to reuse primary.', paths: ['primary', 'hover', 'active', 'subtle', 'subtleHover', 'contrast', 'text'].map(k => `accent.${k}`) },
  { id: 'borders', title: 'Borders', hint: 'Translucent borders adapt to any surface. focus is the keyboard focus ring and needs 3:1 against the page.', paths: ['subtle', 'default', 'strong', 'focus', 'highlight'].map(k => `borders.${k}`) },
  ...STATUSES.map(status => ({
    id: status,
    title: `Status: ${status}`,
    hint: status === 'danger' ? 'Keep danger a visibly different hue from your accent, or errors look like branding.' : 'base for icons and dots, surface and border for alerts, text for readable status copy.',
    paths: ['base', 'surface', 'border', 'text'].map(k => `status.${status}.${k}`),
  })),
];

export function getToken(theme: FieldTheme, path: string): string | undefined {
  return path.split('.').reduce<any>((node, key) => node?.[key], theme.semantics) as string | undefined;
}

/** A new theme with one semantic token replaced (`undefined` removes optional tokens). */
export function setToken(theme: FieldTheme, path: string, value: string | undefined): FieldTheme {
  const keys = path.split('.');
  const semantics = structuredClone(theme.semantics) as any;
  let node = semantics;
  for (const key of keys.slice(0, -1)) node = node[key];
  if (value === undefined || value === '') delete node[keys[keys.length - 1]];
  else node[keys[keys.length - 1]] = value;
  return { ...theme, semantics };
}

/* ---------- Draft ---------- */

export interface Draft {
  pair: FieldThemePair;
  /** Where the draft started, for "compare with starting point". */
  origin: FieldThemePair;
}

export const allPresetPairs: FieldThemePair[] = themePairs;

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'custom';

/** A renamed, independent copy of a pair, so editing never mutates the built-in presets. */
export function clonePair(pair: FieldThemePair, label = pair.label): FieldThemePair {
  const id = slugify(label);
  const copy = structuredClone(pair) as FieldThemePair;
  copy.id = id;
  copy.label = label;
  copy.light = { ...copy.light, id: `${id}-light`, label: `${label} Light` };
  copy.dark = { ...copy.dark, id: `${id}-dark`, label: `${label} Dark` };
  if (copy.band) copy.band = { ...copy.band, id: `${id}-band`, label: `${label} Band` };
  return copy;
}

export function draftFromPreset(pair: FieldThemePair): Draft {
  return { pair: clonePair(pair, `${pair.label.replace(/\s*\(.*\)$/, '')} custom`), origin: structuredClone(pair) };
}

/** Apply the same change to both modes (fonts, radii and typography are shared by default). */
export function mapModes(pair: FieldThemePair, fn: (theme: FieldTheme, mode: Mode) => FieldTheme): FieldThemePair {
  return { ...pair, light: fn(pair.light, 'light'), dark: fn(pair.dark, 'dark') };
}

/* ---------- Undo / redo with coalescing ---------- */

const STORAGE_KEY = 'field-theme-builder:draft';
const SNAPSHOT_KEY = 'field-theme-builder:snapshots';

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the draft just won't survive a reload */
  }
}

/**
 * Draft state with undo / redo. Changes within 500ms (e.g. dragging a colour picker) are
 * merged into one history step. The draft is saved to localStorage on every change.
 */
export function useDraft(initial: () => Draft) {
  const [history, setHistory] = useState<{ stack: Draft[]; index: number }>(() => ({ stack: [initial()], index: 0 }));
  const lastChange = useRef(0);
  const draft = history.stack[history.index];

  const update = useCallback((fn: (d: Draft) => Draft, coalesce = true) => {
    // Decide outside the updater: React may call updaters twice in development.
    const now = Date.now();
    const merge = coalesce && now - lastChange.current < 500;
    lastChange.current = now;
    setHistory(h => {
      const next = fn(h.stack[h.index]);
      const base = h.stack.slice(0, merge && h.index > 0 ? h.index : h.index + 1);
      const stack = [...base, next].slice(-100);
      return { stack, index: stack.length - 1 };
    });
  }, []);

  const replace = useCallback((next: Draft) => update(() => next, false), [update]);
  const undo = useCallback(() => setHistory(h => ({ ...h, index: Math.max(0, h.index - 1) })), []);
  const redo = useCallback(() => setHistory(h => ({ ...h, index: Math.min(h.stack.length - 1, h.index + 1) })), []);

  useEffect(() => writeStorage(STORAGE_KEY, draft), [draft]);

  return {
    draft,
    update,
    replace,
    undo,
    redo,
    canUndo: history.index > 0,
    canRedo: history.index < history.stack.length - 1,
  };
}

export function loadStoredDraft(): Draft | null {
  const stored = readStorage<Draft>(STORAGE_KEY);
  return stored?.pair?.light?.semantics && stored.pair.dark?.semantics ? stored : null;
}

/* ---------- Snapshots ---------- */

export interface Snapshot {
  name: string;
  savedAt: string;
  pair: FieldThemePair;
}

export function useSnapshots() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => readStorage<Snapshot[]>(SNAPSHOT_KEY) ?? []);
  useEffect(() => writeStorage(SNAPSHOT_KEY, snapshots), [snapshots]);
  const save = useCallback((name: string, pair: FieldThemePair) => {
    setSnapshots(list => [{ name, savedAt: new Date().toISOString(), pair: structuredClone(pair) }, ...list.filter(s => s.name !== name)]);
  }, []);
  const remove = useCallback((name: string) => setSnapshots(list => list.filter(s => s.name !== name)), []);
  return { snapshots, save, remove };
}

/* ---------- Share links and import ---------- */

const toBase64Url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64Url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

export function shareUrl(pair: FieldThemePair): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/theme-editor?theme=${toBase64Url(JSON.stringify(pair))}`;
}

/** Reads a pair from a share link, a raw `?theme=` value, or pasted JSON (a pair or { light, dark }). */
export function parseImport(input: string): FieldThemePair | null {
  const text = input.trim();
  try {
    const match = text.match(/[?&]theme=([A-Za-z0-9_-]+)/);
    const json = match ? fromBase64Url(match[1]) : text.startsWith('{') ? text : fromBase64Url(text);
    const value = JSON.parse(json);
    if (value?.light?.semantics && value?.dark?.semantics) {
      return { id: value.id ?? 'imported', label: value.label ?? 'Imported theme', light: value.light, dark: value.dark, band: value.band };
    }
  } catch {
    /* not a theme */
  }
  return null;
}

export function readShareParam(): FieldThemePair | null {
  const match = window.location.hash.match(/[?&]theme=([A-Za-z0-9_-]+)/);
  return match ? parseImport(match[1]) : null;
}

/* ---------- Contrast ---------- */

export function contrastReport(pair: FieldThemePair): Record<Mode, ContrastCheck[]> {
  return { light: checkThemeContrast(pair.light), dark: checkThemeContrast(pair.dark) };
}

export const failures = (report: Record<Mode, ContrastCheck[]>) => [...report.light, ...report.dark].filter(c => !c.pass).length;

/* ---------- Code export ---------- */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Keys of `next` whose values differ from `base` (deep), or undefined when nothing changed. */
function diff(next: any, base: any): any {
  if (typeof next !== 'object' || next === null) return next === base ? undefined : next;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(next)) {
    if (key === 'name' || key === 'mode') continue;
    const d = diff(next[key], base?.[key]);
    if (d !== undefined) out[key] = d;
  }
  return Object.keys(out).length ? out : undefined;
}

const isIdentifier = (k: string) => /^[A-Za-z_$][\w$]*$/.test(k);

function toLiteral(value: Json, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) return `[${value.map(v => toLiteral(v, indent)).join(', ')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    const flat = entries.every(([, v]) => typeof v !== 'object' || v === null);
    const parts = entries.map(([k, v]) => `${isIdentifier(k) ? k : `'${k}'`}: ${toLiteral(v, indent + 1)}`);
    if (flat && parts.join(', ').length < 90) return `{ ${parts.join(', ')} }`;
    return `{\n${parts.map(p => `${pad}  ${p}`).join(',\n')},\n${pad}}`;
  }
  return typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : String(value);
}

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** `createThemePair(...)` source containing only what differs from Field's default themes. */
export function toCreateThemePairCode(pair: FieldThemePair): string {
  const { light, dark } = pair;
  const options: Record<string, Json> = { id: pair.id, label: pair.label };

  const shared: Record<string, Json> = {};
  const perMode: Record<Mode, Record<string, Json>> = { light: {}, dark: {} };
  for (const [key, field] of [['fonts', 'fonts'], ['radii', 'radiiOverrides'], ['typography', 'typography']] as const) {
    const l = (light as any)[field];
    const d = (dark as any)[field];
    if (sameJson(l, d)) {
      if (l && Object.keys(l).length) shared[key] = l;
    } else {
      if (l && Object.keys(l).length) perMode.light[key] = l;
      if (d && Object.keys(d).length) perMode.dark[key] = d;
    }
  }
  if (Object.keys(shared).length) options.shared = shared;

  for (const mode of ['light', 'dark'] as const) {
    const semantics = diff(pair[mode].semantics, (mode === 'light' ? lightTheme : darkTheme).semantics);
    const entry = { ...perMode[mode], ...(semantics ? { semantics } : {}) };
    if (Object.keys(entry).length) options[mode] = entry;
  }
  if (pair.band) {
    const semantics = diff(pair.band.semantics, dark.semantics);
    if (semantics) options.band = { semantics };
  }

  const name = pair.id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase()).replace(/^[^A-Za-z_$]+/, '') || 'custom';
  return `import { createThemePair } from '@sam.barfield/field-tokens';

export const ${name}Pair = createThemePair(${toLiteral(options as Json)});

// <ThemeProvider themePair={${name}Pair} defaultMode="light">…</ThemeProvider>
`;
}

export function semanticsEqual(a: FieldSemanticTokens, b: FieldSemanticTokens) {
  return diff(a, b) === undefined;
}
