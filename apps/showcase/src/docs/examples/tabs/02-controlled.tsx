// title: Controlled
// description: Control activeId yourself, e.g. to sync with the URL.
import { useState } from 'react';
import { Tabs, Text, Stack } from '@sam.barfield/field-react';

export default function TabsControlled() {
  const [tab, setTab] = useState('week');
  return (
    <Stack gap={12} className="example-wide">
      <Tabs
        activeId={tab}
        onChange={setTab}
        items={[
          { id: 'day', label: 'Day' },
          { id: 'week', label: 'Week' },
          { id: 'month', label: 'Month' },
        ]}
      />
      <Text size="sm" tone="secondary">Active tab: {tab}</Text>
    </Stack>
  );
}
