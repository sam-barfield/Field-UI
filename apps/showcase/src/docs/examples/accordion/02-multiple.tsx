// title: Multiple open, controlled
import { useState } from 'react';
import { Accordion, Button, Stack } from '@sam.barfield/field-react';

const ITEMS = [
  { id: 'network', title: 'Networking', content: 'VPC, subnets and security groups.' },
  { id: 'storage', title: 'Storage', content: 'Volumes, snapshots and lifecycle rules.' },
  { id: 'iam', title: 'Access', content: 'Roles, policies and service accounts.' },
];

export default function AccordionMultiple() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <Stack gap={12} className="example-wide" style={{ maxWidth: 620 }}>
      <Button size="sm" onClick={() => setOpen(open.length ? [] : ITEMS.map(i => i.id))}>
        {open.length ? 'Collapse all' : 'Expand all'}
      </Button>
      <Accordion allowMultiple items={ITEMS} openIds={open} onOpenChange={setOpen} />
    </Stack>
  );
}
