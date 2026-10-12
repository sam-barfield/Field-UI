// title: With an action
import { EmptyState, Button } from '@sam.barfield/field-react';
import { HardDrive, Plus } from 'lucide-react';

export default function EmptyStateBasic() {
  return (
    <div className="example-col" style={{ maxWidth: 520 }}>
      <EmptyState
        icon={<HardDrive size={22} />}
        title="No buckets yet"
        description="Buckets store files, backups and static assets. Create one to get started."
        actions={<Button variant="primary" leftIcon={<Plus size={16} />}>Create bucket</Button>}
      />
    </div>
  );
}
