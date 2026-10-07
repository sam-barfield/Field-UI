// title: Link cards and padding
// description: Set href to make the whole card a link (hover elevation is on by default). Pass as={Link} for a router link. Don't put other links or buttons inside a link card.
import { Card, Text, Stack } from '@sam.barfield/field-react';

export default function CardInteractive() {
  return (
    <>
      <Card href="#/components/card" style={{ width: 220 }}>
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
