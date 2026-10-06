// title: Select all (indeterminate)
// description: indeterminate shows a dash and reports a "mixed" state.
import { useState } from 'react';
import { Checkbox, Stack } from '@sam.barfield/field-react';

const PERMISSIONS = ['Read objects', 'Write objects', 'Delete objects'];

export default function CheckboxIndeterminate() {
  const [selected, setSelected] = useState<string[]>(['Read objects']);
  const all = selected.length === PERMISSIONS.length;

  return (
    <Stack gap={10}>
      <Checkbox
        label="All permissions"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onChange={checked => setSelected(checked ? PERMISSIONS : [])}
      />
      <Stack gap={8} style={{ paddingLeft: 26 }}>
        {PERMISSIONS.map(p => (
          <Checkbox
            key={p}
            label={p}
            checked={selected.includes(p)}
            onChange={checked => setSelected(s => (checked ? [...s, p] : s.filter(x => x !== p)))}
          />
        ))}
      </Stack>
    </Stack>
  );
}
