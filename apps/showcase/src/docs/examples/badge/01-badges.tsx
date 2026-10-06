// title: Badges
import { Badge, Flex, Stack } from '@sam.barfield/field-react';

export default function Badges() {
  return (
    <Stack gap={14} align="center">
      <Flex gap={8} wrap="wrap" justify="center">
        <Badge>Default</Badge>
        <Badge variant="accent">Beta</Badge>
        <Badge variant="success" dot>Running</Badge>
        <Badge variant="warning" dot>Pending</Badge>
        <Badge variant="danger" dot>Failed</Badge>
        <Badge variant="info">v2.4.0</Badge>
      </Flex>
      <Flex gap={8} align="center">
        <Badge size="sm" variant="accent">sm</Badge>
        <Badge size="md" variant="accent">md</Badge>
        <Badge size="lg" variant="accent">lg</Badge>
      </Flex>
    </Stack>
  );
}
