// title: Display sizes and lead text
// description: display sizes scale fluidly with the viewport for hero and section headlines; Text size="xl" is the matching intro paragraph. Headings use the theme's display font.
import { Stack, Heading, Text } from '@sam.barfield/field-react';

export default function DisplayType() {
  return (
    <Stack gap="$5" className="example-wide">
      <Heading level={1} display="xl">display="xl"</Heading>
      <Heading level={2} display="lg">display="lg"</Heading>
      <Heading level={2} display="md">display="md"</Heading>
      <Heading level={2} display="sm">display="sm"</Heading>
      <Text size="xl" tone="secondary" style={{ maxWidth: '60ch' }}>
        size="xl": a lead paragraph that introduces a page or section, sized to sit comfortably under a display heading.
      </Text>
    </Stack>
  );
}
