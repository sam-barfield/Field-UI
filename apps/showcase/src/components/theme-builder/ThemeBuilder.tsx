import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  SegmentedControl,
  Select,
  Stack,
  TabPanel,
  Tabs,
  Text,
  TextInput,
  Tooltip,
  themePairs,
  useTheme,
  type FieldThemePair,
} from '@sam.barfield/field-react';
import { Monitor, Redo2, RotateCcw, Undo2 } from 'lucide-react';
import { ContrastPanel } from './ContrastPanel';
import { DiffTable } from './DiffTable';
import { ExportPanel } from './ExportPanel';
import {
  allPresetPairs,
  clonePair,
  contrastReport,
  draftFromPreset,
  failures,
  loadStoredDraft,
  readShareParam,
  slugify,
  useDraft,
  useSnapshots,
  type Mode,
} from './model';
import { ThemePreview } from './Preview';
import { QuickPanel } from './QuickPanel';
import { TokenPanel, type EditTarget } from './TokenPanel';

type View = 'light' | 'dark' | 'both';

const isTyping = (el: Element | null) => !!el && (el.matches('input, textarea, select') || (el as HTMLElement).isContentEditable);

export function ThemeBuilder() {
  const site = useTheme();
  const { snapshots, save, remove } = useSnapshots();
  const { draft, update, replace, undo, redo, canUndo, canRedo } = useDraft(() => {
    const shared = readShareParam();
    if (shared) return { pair: shared, origin: structuredClone(shared) };
    return loadStoredDraft() ?? draftFromPreset(site.themePair ?? themePairs[0]);
  });

  const [tab, setTab] = useState('design');
  const [target, setTarget] = useState<EditTarget>('light');
  const [openGroups, setOpenGroups] = useState<string[]>(['accent']);
  const [view, setView] = useState<View>('both');
  const [compareId, setCompareId] = useState('');

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (or Ctrl+Y), except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || isTyping(document.activeElement)) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const report = useMemo(() => contrastReport(draft.pair), [draft.pair]);
  const failing = failures(report);

  const sourceOptions = [
    ...allPresetPairs.map(p => ({ value: `preset:${p.id}`, label: p.label })),
    ...snapshots.map(s => ({ value: `snapshot:${s.name}`, label: `Snapshot: ${s.name}` })),
  ];

  const resolveSource = (value: string): FieldThemePair | undefined => {
    if (value === 'origin') return draft.origin;
    const [kind, ...rest] = value.split(':');
    const id = rest.join(':');
    return kind === 'preset' ? allPresetPairs.find(p => p.id === id) : snapshots.find(s => s.name === id)?.pair;
  };

  const baseline = compareId ? resolveSource(compareId) : undefined;
  const baselineLabel = compareId === 'origin' ? 'starting point' : sourceOptions.find(o => o.value === compareId)?.label;

  const startFrom = (value: string) => {
    const pair = resolveSource(value);
    if (pair) replace(value.startsWith('preset:') ? draftFromPreset(pair) : { pair: structuredClone(pair), origin: structuredClone(pair) });
  };

  const rename = (label: string) =>
    update(d => {
      const renamed = clonePair(d.pair, label || 'Custom');
      return { ...d, pair: { ...renamed, id: slugify(label || 'Custom') } };
    });

  const modes: Mode[] = view === 'both' ? ['light', 'dark'] : [view];

  return (
    <div className="tb">
      <Flex justify="space-between" align="flex-end" gap="$4" wrap="wrap" className="tb-header">
        <Stack gap="$1">
          <Heading level={1} display="sm">
            Theme builder
          </Heading>
          <Text tone="secondary">
            Build a light and dark theme pair, check its contrast as you go, and export it as code.
          </Text>
        </Stack>
        <Flex gap="$2" align="flex-end" wrap="wrap">
          <div className="tb-start">
            <Select aria-label="Start from" placeholder="Start from…" value="" options={sourceOptions} onChange={startFrom} />
          </div>
          <div className="tb-name">
            <TextInput aria-label="Theme name" value={draft.pair.label} onChange={e => rename(e.target.value)} />
          </div>
          <Tooltip content="Undo (Ctrl+Z)">
            <IconButton variant="ghost" icon={<Undo2 size={16} />} aria-label="Undo" disabled={!canUndo} onClick={undo} />
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Shift+Z)">
            <IconButton variant="ghost" icon={<Redo2 size={16} />} aria-label="Redo" disabled={!canRedo} onClick={redo} />
          </Tooltip>
          <Tooltip content="Use this theme across the whole docs site">
            <Button variant="secondary" leftIcon={<Monitor size={16} />} onClick={() => site.setThemePair(draft.pair)}>
              Try on site
            </Button>
          </Tooltip>
          {site.themePair?.id === draft.pair.id && (
            <Tooltip content="Back to the default site theme">
              <IconButton variant="ghost" icon={<RotateCcw size={16} />} aria-label="Reset site theme" onClick={() => site.setThemePair(themePairs[0])} />
            </Tooltip>
          )}
        </Flex>
      </Flex>

      <div className="tb-layout">
        <Card padding="none" className="tb-sidebar">
          <Tabs
            aria-label="Theme builder tools"
            activeId={tab}
            onChange={setTab}
            items={[
              { id: 'design', label: 'Design' },
              { id: 'tokens', label: 'Tokens' },
              { id: 'contrast', label: 'Contrast', badge: <Badge size="sm" variant={failing ? 'danger' : 'success'}>{failing || '✓'}</Badge> },
            ]}
          >
            <TabPanel id="design">
              <div className="tb-panel">
                <QuickPanel draft={draft} update={update} />
              </div>
            </TabPanel>
            <TabPanel id="tokens">
              <div className="tb-panel">
                <TokenPanel draft={draft} update={update} target={target} onTargetChange={setTarget} openGroups={openGroups} onOpenGroupsChange={setOpenGroups} />
              </div>
            </TabPanel>
            <TabPanel id="contrast">
              <div className="tb-panel">
                <ContrastPanel draft={draft} update={update} baseline={baseline} baselineLabel={baselineLabel} />
              </div>
            </TabPanel>
          </Tabs>
        </Card>

        <Stack gap="$5" className="tb-main">
          <Flex justify="space-between" align="flex-end" gap="$3" wrap="wrap">
            <SegmentedControl
              aria-label="Preview mode"
              size="sm"
              value={view}
              onChange={setView}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'both', label: 'Both' },
              ]}
            />
            <div className="tb-compare">
              <Select
                label="Compare with"
                value={compareId}
                onChange={setCompareId}
                options={[{ value: '', label: 'Nothing' }, { value: 'origin', label: 'Starting point' }, ...sourceOptions]}
              />
            </div>
          </Flex>

          {baseline ? (
            <Stack gap="$4">
              {modes.map(mode => (
                <div key={mode} className="tb-preview-grid">
                  <Stack gap="$2">
                    <Text size="sm" weight="semibold">
                      Draft · {mode}
                    </Text>
                    <ThemePreview pair={draft.pair} mode={mode} label={`Draft, ${mode} mode`} />
                  </Stack>
                  <Stack gap="$2">
                    <Text size="sm" weight="semibold">
                      {baselineLabel} · {mode}
                    </Text>
                    <ThemePreview pair={baseline} mode={mode} label={`${baselineLabel}, ${mode} mode`} />
                  </Stack>
                </div>
              ))}
              <Card padding="none" className="tb-clip">
                <DiffTable draft={draft.pair} baseline={baseline} />
              </Card>
            </Stack>
          ) : (
            <div className={view === 'both' ? 'tb-preview-grid' : undefined}>
              {modes.map(mode => (
                <ThemePreview key={mode} pair={draft.pair} mode={mode} />
              ))}
            </div>
          )}

          <Card padding="lg">
            <Stack gap="$4">
              <Heading level={2}>Export</Heading>
              <ExportPanel
                pair={draft.pair}
                onImport={pair => replace({ pair, origin: structuredClone(pair) })}
                snapshots={snapshots}
                onSaveSnapshot={name => save(name, draft.pair)}
                onLoadSnapshot={s => replace({ pair: structuredClone(s.pair), origin: structuredClone(s.pair) })}
                onDeleteSnapshot={remove}
              />
            </Stack>
          </Card>
        </Stack>
      </div>
    </div>
  );
}
