// title: Headings and text
import { Heading, Text, Stack } from '@sam.barfield/field-react';

export default function TypeScale() {
  return (
    <Stack gap={10} className="example-wide">
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Text size="lg">Large body text for introductions.</Text>
      <Text>Base body text for most content.</Text>
      <Text size="sm" tone="secondary">Small secondary text for supporting details.</Text>
      <Text size="xs" tone="tertiary">Extra small tertiary text for metadata.</Text>
    </Stack>
  );
}
