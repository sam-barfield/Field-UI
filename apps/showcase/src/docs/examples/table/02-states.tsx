// title: Loading, empty and expandable rows
import { useState } from 'react';
import { Table, Button, Flex, Stack, EmptyState } from '@sam.barfield/field-react';
import { Inbox } from 'lucide-react';

const rows = [
  { id: 'evt-1', event: 'Deploy started', actor: 'ada', detail: 'Commit 4f2a1c by ada: "Bump runtime to Node 22"' },
  { id: 'evt-2', event: 'Scaled to 6', actor: 'autoscaler', detail: 'CPU above 70% for 5 minutes' },
];

export default function TableStates() {
  const [mode, setMode] = useState<'data' | 'loading' | 'empty'>('data');
  return (
    <Stack gap={12} className="example-wide">
      <Flex gap={8}>
        {(['data', 'loading', 'empty'] as const).map(m => (
          <Button key={m} size="sm" variant={mode === m ? 'primary' : 'secondary'} onClick={() => setMode(m)}>
            {m}
          </Button>
        ))}
      </Flex>
      <Table
        isLoading={mode === 'loading'}
        loadingRows={3}
        data={mode === 'empty' ? [] : rows}
        keyExtractor={r => r.id}
        expandable
        renderExpandedRow={r => r.detail}
        emptyMessage={<EmptyState icon={<Inbox size={22} />} title="No events" description="Events appear here as they happen." />}
        columns={[
          { key: 'event', header: 'Event' },
          { key: 'actor', header: 'Actor' },
        ]}
      />
    </Stack>
  );
}
