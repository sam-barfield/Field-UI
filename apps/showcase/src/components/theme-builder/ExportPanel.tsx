import { useState } from 'react';
import {
  Button,
  CodeBlock,
  Flex,
  IconButton,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  TextArea,
  TextInput,
  themePairToCssString,
  themeToDtcgJson,
  useToast,
  type FieldThemePair,
} from '@sam.barfield/field-react';
import { Download, FolderOpen, Link2, Save, Trash2, Upload } from 'lucide-react';
import { parseImport, shareUrl, toCreateThemePairCode, type Snapshot } from './model';

type Format = 'ts' | 'css' | 'json' | 'dtcg';

const FILES: Record<Format, { name: string; language: string }> = {
  ts: { name: 'theme.ts', language: 'tsx' },
  css: { name: 'theme.css', language: 'css' },
  json: { name: 'theme.json', language: 'json' },
  dtcg: { name: 'tokens.json', language: 'json' },
};

function exportCode(pair: FieldThemePair, format: Format): string {
  switch (format) {
    case 'ts':
      return toCreateThemePairCode(pair);
    case 'css':
      return themePairToCssString(pair);
    case 'json':
      return JSON.stringify(pair, null, 2);
    case 'dtcg':
      return JSON.stringify({ light: JSON.parse(themeToDtcgJson(pair.light)), dark: JSON.parse(themeToDtcgJson(pair.dark)) }, null, 2);
  }
}

const HINTS: Record<Format, string> = {
  ts: 'Recommended. Only the tokens that differ from Field’s defaults, ready for ThemeProvider themePair.',
  css: 'Dark on :root, light under [data-theme="light"], for static pages. The band theme is not included.',
  json: 'The full pair. Re-import it here later, or keep it with your project.',
  dtcg: 'W3C Design Tokens (DTCG) for design tools such as Figma Tokens.',
};

export function ExportPanel({
  pair,
  onImport,
  snapshots,
  onSaveSnapshot,
  onLoadSnapshot,
  onDeleteSnapshot,
}: {
  pair: FieldThemePair;
  onImport: (pair: FieldThemePair) => void;
  snapshots: Snapshot[];
  onSaveSnapshot: (name: string) => void;
  onLoadSnapshot: (snapshot: Snapshot) => void;
  onDeleteSnapshot: (name: string) => void;
}) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<Format>('ts');
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string>();
  const [snapshotName, setSnapshotName] = useState('');

  const code = exportCode(pair, format);

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = FILES[format].name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl(pair));
      showToast({ title: 'Share link copied', description: 'Anyone with the link opens this theme in the builder.', variant: 'success' });
    } catch {
      showToast({ title: 'Could not copy the link', variant: 'danger' });
    }
  };

  const runImport = () => {
    const imported = parseImport(importText);
    if (!imported) {
      setImportError('Paste a share link or the JSON export (a pair with light and dark themes).');
      return;
    }
    onImport(imported);
    setImportOpen(false);
    setImportText('');
    setImportError(undefined);
  };

  return (
    <Stack gap="$4">
      <Flex justify="space-between" align="center" gap="$3" wrap="wrap">
        <SegmentedControl
          aria-label="Export format"
          size="sm"
          value={format}
          onChange={setFormat}
          options={[
            { value: 'ts', label: 'createThemePair' },
            { value: 'css', label: 'CSS' },
            { value: 'json', label: 'JSON' },
            { value: 'dtcg', label: 'DTCG' },
          ]}
        />
        <Flex gap="$2" wrap="wrap">
          <Button size="sm" variant="secondary" leftIcon={<Link2 size={14} />} onClick={copyShareLink}>
            Copy share link
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<Upload size={14} />} onClick={() => setImportOpen(true)}>
            Import
          </Button>
          <Button size="sm" variant="primary" leftIcon={<Download size={14} />} onClick={download}>
            Download {FILES[format].name}
          </Button>
        </Flex>
      </Flex>
      <Text size="sm" tone="secondary">
        {HINTS[format]}
      </Text>
      <CodeBlock code={code} language={FILES[format].language} maxHeight="420px" copyable />

      <Stack gap="$2" as="section" aria-labelledby="tb-snapshots">
        <Text id="tb-snapshots" weight="semibold">
          Snapshots
        </Text>
        <Text size="sm" tone="secondary">
          Saved in this browser. Save one before a big change, then pick it under Compare to see what moved.
        </Text>
        <form
          onSubmit={e => {
            e.preventDefault();
            const name = snapshotName.trim() || `${pair.label} ${new Date().toLocaleTimeString()}`;
            onSaveSnapshot(name);
            setSnapshotName('');
            showToast({ title: 'Snapshot saved', description: name, variant: 'success' });
          }}
        >
          <Flex gap="$2" align="flex-end">
            <div className="tb-flex-field">
              <TextInput label="Snapshot name" placeholder={pair.label} value={snapshotName} onChange={e => setSnapshotName(e.target.value)} />
            </div>
            <Button type="submit" variant="secondary" leftIcon={<Save size={14} />}>
              Save
            </Button>
          </Flex>
        </form>
        {snapshots.length > 0 && (
          <ul className="tb-snapshot-list">
            {snapshots.map(s => (
              <li key={s.name}>
                <span className="tb-snapshot-swatches" aria-hidden="true">
                  <span style={{ background: s.pair.light.semantics.surfaces.base }} />
                  <span style={{ background: s.pair.light.semantics.accent.primary }} />
                  <span style={{ background: s.pair.dark.semantics.surfaces.base }} />
                  <span style={{ background: s.pair.dark.semantics.accent.primary }} />
                </span>
                <span className="tb-snapshot-name">
                  {s.name}
                  <Text as="span" size="xs" tone="tertiary">
                    {' '}
                    {new Date(s.savedAt).toLocaleString()}
                  </Text>
                </span>
                <Button size="sm" variant="ghost" leftIcon={<FolderOpen size={14} />} onClick={() => onLoadSnapshot(s)}>
                  Load
                </Button>
                <IconButton size="sm" variant="ghost" icon={<Trash2 size={14} />} aria-label={`Delete snapshot ${s.name}`} onClick={() => onDeleteSnapshot(s.name)} />
              </li>
            ))}
          </ul>
        )}
      </Stack>

      <Modal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import a theme"
        description="Paste a share link or a JSON export. It replaces the current draft (Undo brings it back)."
        footer={
          <Flex gap="$2" justify="flex-end">
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={runImport}>
              Import
            </Button>
          </Flex>
        }
      >
        <TextArea
          label="Share link or JSON"
          rows={8}
          value={importText}
          onChange={e => {
            setImportText(e.target.value);
            setImportError(undefined);
          }}
          error={importError}
        />
      </Modal>
    </Stack>
  );
}
