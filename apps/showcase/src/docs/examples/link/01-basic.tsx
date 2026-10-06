// title: Links in text
// description: Links are underlined by default so they stand out in body copy without relying on colour. external opens a new tab safely and tells screen-reader users.
import { Link, Stack, Text } from '@sam.barfield/field-react';

export default function LinkBasic() {
  return (
    <Stack gap="$4" className="example-col">
      <Text>
        Read our <Link href="#/components/link">allergen information</Link> before ordering, or{' '}
        <Link href="https://www.openstreetmap.org" external>get directions</Link>.
      </Text>
      <Text size="sm" tone="secondary">
        tone="subtle" with underline="hover":{' '}
        <Link href="#/components/link" tone="subtle" underline="hover">Privacy policy</Link>
      </Text>
      <Text size="sm" tone="secondary">
        tone="inherit" takes the surrounding colour:{' '}
        <Link href="#/components/link" tone="inherit">Terms of service</Link>
      </Text>
    </Stack>
  );
}
