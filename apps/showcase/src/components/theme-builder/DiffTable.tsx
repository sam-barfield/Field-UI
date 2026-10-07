import { Table, Text, type Column, type FieldTheme, type FieldThemePair } from '@sam.barfield/field-react';
import { isColor } from './color';
import { getToken, TOKEN_GROUPS } from './model';

interface Row {
  key: string;
  theme: string;
  token: string;
  before?: string;
  after?: string;
}

const SETTINGS: { label: string; read: (t: FieldTheme) => unknown }[] = [
  { label: 'fonts', read: t => t.fonts },
  { label: 'radii', read: t => t.radiiOverrides },
  { label: 'typography', read: t => t.typography },
];

function rowsFor(name: string, after: FieldTheme | undefined, before: FieldTheme | undefined): Row[] {
  if (!after && !before) return [];
  const rows: Row[] = [];
  for (const path of TOKEN_GROUPS.flatMap(g => g.paths)) {
    const a = after && getToken(after, path);
    const b = before && getToken(before, path);
    if ((a ?? '').toUpperCase() !== (b ?? '').toUpperCase()) rows.push({ key: `${name}-${path}`, theme: name, token: path, before: b, after: a });
  }
  for (const setting of SETTINGS) {
    const a = after ? JSON.stringify(setting.read(after) ?? {}) : '';
    const b = before ? JSON.stringify(setting.read(before) ?? {}) : '';
    if (a !== b) rows.push({ key: `${name}-${setting.label}`, theme: name, token: setting.label, before: b, after: a });
  }
  return rows;
}

function Value({ value }: { value?: string }) {
  if (!value) return <Text size="sm" tone="tertiary">-</Text>;
  return (
    <span className="tb-diff-value">
      {isColor(value) && <span className="tb-diff-swatch" style={{ background: value }} aria-hidden="true" />}
      <code>{value}</code>
    </span>
  );
}

const columns: Column<Row>[] = [
  { key: 'theme', header: 'Theme', width: 70 },
  { key: 'token', header: 'Token', render: r => <code>{r.token}</code> },
  { key: 'before', header: 'Baseline', render: r => <Value value={r.before} /> },
  { key: 'after', header: 'Draft', render: r => <Value value={r.after} /> },
];

/** Every token and setting that differs between the draft and the comparison baseline. */
export function DiffTable({ draft, baseline }: { draft: FieldThemePair; baseline: FieldThemePair }) {
  const rows = [
    ...rowsFor('light', draft.light, baseline.light),
    ...rowsFor('dark', draft.dark, baseline.dark),
    ...rowsFor('band', draft.band, baseline.band),
  ];
  return (
    <Table
      columns={columns}
      data={rows}
      keyExtractor={r => r.key}
      density="compact"
      caption="Tokens that differ from the baseline"
      emptyMessage={<Text size="sm" tone="secondary">No differences.</Text>}
    />
  );
}
