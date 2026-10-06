// title: Interactive and padding
// description: variant="interactive" adds hover elevation. Make it focusable when it is clickable.
import { Card, Text, Stack } from '@sam.barfield/field-react';

export default function CardInteractive() {
  return (
    <>
      <Card variant="interactive" tabIndex={0} role="link" onClick={() => alert('Open project')} style={{ width: 220 }}>
        <Stack gap={4}>
          <Text weight="semibold">Billing service</Text>
          <Text size="sm" tone="secondary">Click or press Enter</Text>
        </Stack>
      </Card>
      <Card padding="sm" style={{ width: 160 }}>
        <Text size="sm">padding="sm"</Text>
      </Card>
      <Card padding="lg" style={{ width: 160 }}>
        <Text size="sm">padding="lg"</Text>
      </Card>
    </>
  );
}
