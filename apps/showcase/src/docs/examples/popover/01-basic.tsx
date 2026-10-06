// title: Details on demand
import { Popover, Button, Stack, Text, Flex, Badge } from '@sam.barfield/field-react';
import { Info } from 'lucide-react';

export default function PopoverBasic() {
  return (
    <Popover
      aria-label="Cost breakdown"
      trigger={<Button variant="outline" leftIcon={<Info size={14} />}>Cost breakdown</Button>}
      content={
        <Stack gap={8}>
          <Text weight="semibold" size="sm">October estimate</Text>
          <Flex justify="space-between"><Text size="sm" tone="secondary">Compute</Text><Text size="sm">$412</Text></Flex>
          <Flex justify="space-between"><Text size="sm" tone="secondary">Storage</Text><Text size="sm">$96</Text></Flex>
          <Flex justify="space-between"><Text size="sm" tone="secondary">Egress</Text><Badge size="sm" variant="warning">$38</Badge></Flex>
        </Stack>
      }
    />
  );
}
