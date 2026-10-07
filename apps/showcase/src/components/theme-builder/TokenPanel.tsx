import { Accordion, Badge, IconButton, SegmentedControl, Stack, Text, Tooltip, contrastRatio, type FieldTheme } from '@sam.barfield/field-react';
import { Wand2 } from 'lucide-react';
import { ColorField } from './ColorField';
import { isColor } from './color';
import { deriveGroup } from './generate';
import { getToken, setToken, TOKEN_GROUPS, type Draft, type TokenGroup } from './model';

export type EditTarget = 'light' | 'dark' | 'band';

/** Foreground tokens get their contrast against surfaces.base shown next to the label. */
const TEXT_LIKE = /^(text\.(primary|secondary|tertiary)|accent\.text|status\.\w+\.text)$/;

function RatioBadge({ theme, path }: { theme: FieldTheme; path: string }) {
  if (!TEXT_LIKE.test(path)) return null;
  const fg = getToken(theme, path) ?? (path === 'accent.text' ? theme.semantics.accent.primary : undefined);
  const bg = theme.semantics.surfaces.base;
  if (!isColor(fg) || !isColor(bg)) return null;
  const ratio = contrastRatio(fg, bg, bg);
  return (
    <Badge size="sm" variant={ratio >= 4.5 ? 'success' : 'danger'}>
      {ratio.toFixed(2)}:1
    </Badge>
  );
}

/** Every semantic token, grouped, for one mode (or the band theme). */
export function TokenPanel({
  draft,
  update,
  target,
  onTargetChange,
  openGroups,
  onOpenGroupsChange,
}: {
  draft: Draft;
  update: (fn: (d: Draft) => Draft, coalesce?: boolean) => void;
  target: EditTarget;
  onTargetChange: (t: EditTarget) => void;
  openGroups: string[];
  onOpenGroupsChange: (ids: string[]) => void;
}) {
  const theme = target === 'band' ? draft.pair.band ?? draft.pair.dark : draft.pair[target];

  const editTheme = (fn: (theme: FieldTheme) => FieldTheme, coalesce = true) =>
    update(d => {
      const current = target === 'band' ? d.pair.band : d.pair[target];
      if (!current) return d;
      return { ...d, pair: { ...d.pair, [target]: fn(current) } };
    }, coalesce);

  const change = (path: string, value: string | undefined) => editTheme(theme => setToken(theme, path, value));

  // One undo step, so a generated group can be reverted with Ctrl+Z.
  const derive = (group: TokenGroup) =>
    editTheme(theme => ({ ...theme, semantics: deriveGroup(group.id, theme.semantics, theme.mode) }), false);

  const deriveButton = (group: TokenGroup) => {
    const seedName = group.seed.split('.').slice(-1)[0];
    const others = group.paths.filter(p => p !== group.seed && !(group.id === 'borders' && /focus|highlight/.test(p))).map(p => p.split('.').slice(-1)[0]);
    const label = `Generate ${others.join(', ')} from ${seedName}`;
    return (
      <Tooltip content={label}>
        <IconButton variant="secondary" size="sm" icon={<Wand2 size={14} />} aria-label={label} onClick={() => derive(group)} />
      </Tooltip>
    );
  };

  return (
    <Stack gap="$4">
      <SegmentedControl
        aria-label="Theme to edit"
        size="sm"
        isFullWidth
        value={target}
        onChange={onTargetChange}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'band', label: 'Band', disabled: !draft.pair.band },
        ]}
      />
      <Text size="xs" tone="secondary">
        Ratios are against surfaces.base. The Contrast tab checks every pairing. Set the colour with the wand beside it and click the wand to
        generate the rest of that group.
      </Text>
      <Accordion
        allowMultiple
        openIds={openGroups}
        onOpenChange={onOpenGroupsChange}
        items={TOKEN_GROUPS.map(group => ({
          id: group.id,
          title: group.title,
          content: (
            <Stack gap="$3">
              <Text size="xs" tone="secondary">
                {group.hint}
              </Text>
              {group.paths.map(path => (
                <div key={path} id={`tb-token-${path.replace(/\./g, '-')}`}>
                  <ColorField
                    label={path.split('.').slice(-1)[0]}
                    value={getToken(theme, path)}
                    onChange={v => change(path, v)}
                    optional={path === 'accent.text'}
                    placeholder={path === 'accent.text' ? `same as primary (${theme.semantics.accent.primary})` : undefined}
                    meta={<RatioBadge theme={theme} path={path} />}
                    action={path === group.seed ? deriveButton(group) : undefined}
                  />
                </div>
              ))}
            </Stack>
          ),
        }))}
      />
    </Stack>
  );
}
