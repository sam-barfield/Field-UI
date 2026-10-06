// title: Time range
import { useState } from 'react';
import { SegmentedControl, Text } from '@sam.barfield/field-react';

type Range = '24h' | '7d' | '30d' | '90d';

export default function SegmentedBasic() {
  const [range, setRange] = useState<Range>('7d');
  return (
    <div className="example-col" style={{ alignItems: 'center' }}>
      <SegmentedControl<Range>
        aria-label="Time range"
        value={range}
        onChange={setRange}
        options={[
          { value: '24h', label: '24h' },
          { value: '7d', label: '7 days' },
          { value: '30d', label: '30 days' },
          { value: '90d', label: '90 days' },
        ]}
      />
      <Text size="sm" tone="secondary">Showing the last {range}</Text>
    </div>
  );
}
