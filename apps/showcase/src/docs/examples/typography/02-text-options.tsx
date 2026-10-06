// title: Tone, weight, mono, truncate, Kbd and Code
import { Text, Kbd, Code, Stack, Heading } from '@sam.barfield/field-react';

export default function TextOptions() {
  return (
    <Stack gap={10} className="example-col">
      <Heading level={1} as="h3">Looks like h1, is an h3</Heading>
      <Text tone="success" weight="semibold">Deployed successfully</Text>
      <Text tone="danger" size="sm">3 checks failed</Text>
      <Text mono size="sm">i-0a89bc34e12f8091a</Text>
      <Text truncate style={{ maxWidth: 240 }}>arn:aws:iam::123456789012:role/service-role/very-long-name</Text>
      <Text size="sm" tone="secondary">
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or run <Code>npm run dev</Code>.
      </Text>
    </Stack>
  );
}
