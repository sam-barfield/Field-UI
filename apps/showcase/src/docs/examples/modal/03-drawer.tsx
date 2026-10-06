// title: Drawer
// description: Slides in from the right (or left with side="left"). Good for details and filters.
import { useState } from 'react';
import { Drawer, Button, Stack, Text, Badge, Flex, Divider } from '@sam.barfield/field-react';

export default function DrawerExample() {
  const [side, setSide] = useState<'left' | 'right' | null>(null);
  return (
    <>
      <Button onClick={() => setSide('right')}>Open details</Button>
      <Button variant="ghost" onClick={() => setSide('left')}>Open from left</Button>
      <Drawer
        isOpen={side !== null}
        side={side ?? 'right'}
        onClose={() => setSide(null)}
        title="api-gateway-1"
        description="i-0a89bc34e12f8091a"
        footer={<Button variant="primary" onClick={() => setSide(null)}>Done</Button>}
      >
        <Stack gap={12}>
          <Flex justify="space-between"><Text size="sm" tone="secondary">State</Text><Badge variant="success" dot>Running</Badge></Flex>
          <Divider />
          <Flex justify="space-between"><Text size="sm" tone="secondary">Type</Text><Text size="sm" mono>c6i.large</Text></Flex>
          <Flex justify="space-between"><Text size="sm" tone="secondary">Zone</Text><Text size="sm" mono>us-east-1a</Text></Flex>
        </Stack>
      </Drawer>
    </>
  );
}
