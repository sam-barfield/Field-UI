// title: Stack and Flex
// description: gap accepts px numbers, CSS lengths, or spacing tokens like "$4".
import { Stack, Flex, Button, Text, Heading } from '@sam.barfield/field-react';

export default function StackFlex() {
  return (
    <Stack gap="$4" className="example-col">
      <Flex justify="space-between" align="center" gap={12}>
        <Heading level={4}>Deployments</Heading>
        <Button size="sm" variant="primary">New deployment</Button>
      </Flex>
      <Text size="sm" tone="secondary">
        Stack lays children out vertically with consistent spacing; Flex handles rows and alignment.
      </Text>
      <Flex gap="$2" wrap="wrap">
        <Button size="sm">Logs</Button>
        <Button size="sm">Metrics</Button>
        <Button size="sm">Settings</Button>
      </Flex>
    </Stack>
  );
}
