// title: Icons, small and full width
// description: Give icon-only options an aria-label. isFullWidth stretches the segments.
import { useState } from 'react';
import { SegmentedControl } from '@sam.barfield/field-react';
import { LayoutGrid, List, Map } from 'lucide-react';

export default function SegmentedIcons() {
  const [view, setView] = useState('grid');
  const [env, setEnv] = useState('staging');
  return (
    <div className="example-col">
      <SegmentedControl
        size="sm"
        aria-label="View"
        value={view}
        onChange={setView}
        options={[
          { value: 'grid', label: <LayoutGrid size={14} />, 'aria-label': 'Grid view' },
          { value: 'list', label: <List size={14} />, 'aria-label': 'List view' },
          { value: 'map', label: <Map size={14} />, 'aria-label': 'Map view', disabled: true },
        ]}
      />
      <SegmentedControl
        isFullWidth
        aria-label="Environment"
        value={env}
        onChange={setEnv}
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'staging', label: 'Staging' },
          { value: 'prod', label: 'Production' },
        ]}
      />
    </div>
  );
}
