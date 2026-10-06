// title: Divider and Box
import { Box, Divider, Flex, Text } from '@sam.barfield/field-react';

export default function DividerExample() {
  return (
    <Box padding="$4" className="example-col" style={{ border: '1px solid var(--field-border-subtle)', borderRadius: 'var(--field-radius-lg)' }}>
      <Text weight="semibold">Usage this month</Text>
      <Divider />
      <Flex align="center" gap={4}>
        <Text size="sm" tone="secondary">Compute $412</Text>
        <Divider orientation="vertical" />
        <Text size="sm" tone="secondary">Storage $96</Text>
        <Divider orientation="vertical" />
        <Text size="sm" tone="secondary">Egress $38</Text>
      </Flex>
    </Box>
  );
}
