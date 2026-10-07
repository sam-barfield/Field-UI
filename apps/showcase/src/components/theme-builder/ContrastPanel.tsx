import { useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Stack,
  Switch,
  Text,
  checkThemeContrast,
  contrastRatio,
  type ContrastCheck,
  type FieldTheme,
  type FieldThemePair,
} from '@sam.barfield/field-react';
import { Wand2 } from 'lucide-react';
import { bestContrastText, fixContrast, hueGap, rotateHue } from './color';
import { getToken, setToken, type Draft } from './model';
import type { EditTarget } from './TokenPanel';

const MIN_HUE_GAP = 20;

/**
 * Adjusts one theme so `check` passes, changing as little as possible: the foreground's
 * lightness for text, or the fill's lightness when the text sits on an accent fill.
 */
export function fixCheck(theme: FieldTheme, check: ContrastCheck): FieldTheme | null {
  const [fgPath, bgPath] = check.label.split(' on ');
  const base = theme.semantics.surfaces.base;

  if (fgPath === 'accent.contrast') {
    const { primary, hover } = theme.semantics.accent;
    const best = bestContrastText(primary);
    if (contrastRatio(best, primary) >= check.minimum && contrastRatio(best, hover) >= check.minimum) {
      return setToken(theme, 'accent.contrast', best);
    }
    const fill = getToken(theme, bgPath) ?? check.background;
    const fixedFill = fixContrast(fill, check.foreground, check.minimum, base);
    return fixedFill ? setToken(theme, bgPath, fixedFill) : null;
  }

  const fixed = fixContrast(check.foreground, check.background, check.minimum, base);
  return fixed ? setToken(theme, fgPath, fixed) : null;
}

/**
 * Rotates the four danger tokens 35° away from the accent's hue, in whichever direction also
 * stays clear of the warning colour (so a red brand gets a raspberry danger, not an orange one),
 * then re-checks their contrast.
 */
export function separateDanger(theme: FieldTheme): FieldTheme {
  const { accent, status } = theme.semantics;
  const clearance = (degrees: number) => {
    const rotated = rotateHue(status.danger.base, degrees);
    return Math.min(hueGap(rotated, accent.primary) ?? 180, hueGap(rotated, status.warning.base) ?? 180);
  };
  const shift = clearance(-35) >= clearance(35) ? -35 : 35;
  let next = theme;
  for (const key of ['base', 'surface', 'border', 'text'] as const) {
    next = setToken(next, `status.danger.${key}`, rotateHue(status.danger[key], shift));
  }
  return fixAll(next);
}

/** Fix every failing pairing (a few passes, since fixing against one surface can affect another). */
export function fixAll(theme: FieldTheme): FieldTheme {
  let next = theme;
  for (let pass = 0; pass < 4; pass++) {
    const failing = checkThemeContrast(next).filter(c => !c.pass);
    if (!failing.length) break;
    for (const check of failing) next = fixCheck(next, check) ?? next;
  }
  return next;
}

function Sample({ check }: { check: ContrastCheck }) {
  return (
    <span className="tb-sample" style={{ color: check.foreground, background: check.background }} aria-hidden="true">
      Aa
    </span>
  );
}

const TARGETS: { id: EditTarget; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'band', label: 'Band' },
];

/** WCAG AA results for every pairing in each mode, with fixes and an optional baseline to compare against. */
export function ContrastPanel({
  draft,
  update,
  baseline,
  baselineLabel,
}: {
  draft: Draft;
  update: (fn: (d: Draft) => Draft, coalesce?: boolean) => void;
  baseline?: FieldThemePair;
  baselineLabel?: string;
}) {
  const [onlyFailures, setOnlyFailures] = useState(false);

  const themeFor = (pair: FieldThemePair | undefined, t: EditTarget) => (t === 'band' ? pair?.band : pair?.[t]);
  const applyTo = (t: EditTarget, fn: (theme: FieldTheme) => FieldTheme) =>
    update(d => {
      const current = themeFor(d.pair, t);
      return current ? { ...d, pair: { ...d.pair, [t]: fn(current) } } : d;
    }, false);

  return (
    <Stack gap="$5">
      <Text size="sm" tone="secondary">
        Text needs 4.5:1 against what it sits on (WCAG AA); focus rings need 3:1. Fix nudges the colour's lightness as
        little as possible and keeps its hue.
        {baseline ? ` Ratios show ${baselineLabel ?? 'baseline'} → draft.` : ''}
      </Text>
      <Switch size="sm" label="Only show failures" checked={onlyFailures} onChange={setOnlyFailures} />

      {TARGETS.map(({ id, label }) => {
        const theme = themeFor(draft.pair, id);
        if (!theme) return null;
        const checks = checkThemeContrast(theme);
        const before = new Map((themeFor(baseline, id) ? checkThemeContrast(themeFor(baseline, id)!) : []).map(c => [c.label, c.ratio]));
        const failing = checks.filter(c => !c.pass);
        const rows = onlyFailures ? failing : checks;
        const gap = hueGap(theme.semantics.status.danger.base, theme.semantics.accent.primary);

        return (
          <Stack key={id} gap="$2" as="section" aria-label={`${label} contrast`}>
            <Flex justify="space-between" align="center" gap="$2" wrap="wrap">
              <Flex gap="$2" align="center">
                <Text weight="semibold">{label}</Text>
                <Badge size="sm" variant={failing.length ? 'danger' : 'success'}>
                  {failing.length ? `${failing.length} failing` : 'All pass'}
                </Badge>
              </Flex>
              {failing.length > 0 && (
                <Button size="sm" variant="secondary" leftIcon={<Wand2 size={14} />} onClick={() => applyTo(id, fixAll)}>
                  Fix all
                </Button>
              )}
            </Flex>

            <ul className="tb-check-list">
              {rows.map(check => {
                const was = before.get(check.label);
                const changed = was !== undefined && Math.abs(was - check.ratio) > 0.005;
                return (
                  <li key={check.label} className={check.pass ? undefined : 'fail'}>
                    <Sample check={check} />
                    <span className="tb-check-text">
                      <span className="tb-check-label">{check.label}</span>
                      <span className="tb-check-ratio">
                        {changed && <span className="tb-check-was">{was!.toFixed(2)} → </span>}
                        {check.ratio.toFixed(2)}
                        <span className="tb-check-min"> / {check.minimum}</span>
                      </span>
                    </span>
                    {check.pass ? (
                      <Badge size="sm" variant="success">Pass</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => applyTo(id, t => fixCheck(t, check) ?? t)}>
                        Fix
                      </Button>
                    )}
                  </li>
                );
              })}
              {rows.length === 0 && (
                <li>
                  <Text size="sm" tone="secondary">
                    No failures.
                  </Text>
                </li>
              )}
            </ul>

            {gap !== null && (!onlyFailures || gap < MIN_HUE_GAP) && (
              <Flex gap="$2" align="center" wrap="wrap">
                <Text size="xs" tone={gap < MIN_HUE_GAP ? 'danger' : 'secondary'}>
                  Danger vs accent hue: {Math.round(gap)}°{gap < MIN_HUE_GAP ? ' - too close: errors may read as branding.' : ' - distinct.'}
                </Text>
                {gap < MIN_HUE_GAP && (
                  <Button size="sm" variant="outline" onClick={() => applyTo(id, separateDanger)}>
                    Shift danger hue
                  </Button>
                )}
              </Flex>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
