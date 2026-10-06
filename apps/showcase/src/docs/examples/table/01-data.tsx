// title: Sorting, selection and bulk actions
// description: Pass columns and data. keyExtractor gives rows stable keys for selection.
import { Table, Badge, Button, type Column } from '@sam.barfield/field-react';

interface Instance {
  id: string;
  name: string;
  state: 'running' | 'stopped' | 'pending';
  type: string;
  cpu: number;
}

const DATA: Instance[] = [
  { id: 'i-01', name: 'api-gateway-1', state: 'running', type: 'c6i.large', cpu: 42 },
  { id: 'i-02', name: 'api-gateway-2', state: 'running', type: 'c6i.large', cpu: 38 },
  { id: 'i-03', name: 'worker-queue', state: 'pending', type: 'm6g.xlarge', cpu: 0 },
  { id: 'i-04', name: 'batch-spark', state: 'stopped', type: 'r6i.4xlarge', cpu: 0 },
];

const STATE_VARIANT = { running: 'success', stopped: 'default', pending: 'warning' } as const;

const columns: Column<Instance>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'state', header: 'State', sortable: true, render: r => <Badge variant={STATE_VARIANT[r.state]} dot>{r.state}</Badge> },
  { key: 'type', header: 'Type', render: r => <code>{r.type}</code> },
  { key: 'cpu', header: 'CPU', align: 'right', sortable: true, render: r => `${r.cpu}%` },
];

export default function TableData() {
  return (
    <div className="example-wide">
      <Table
        columns={columns}
        data={DATA}
        keyExtractor={r => r.id}
        selectable
        defaultSortKey="name"
        caption="EC2 instances"
        renderBulkActions={(keys, clear) => (
          <>
            <Button size="sm" onClick={clear}>Clear</Button>
            <Button size="sm" variant="danger">Stop {keys.length}</Button>
          </>
        )}
      />
    </div>
  );
}
