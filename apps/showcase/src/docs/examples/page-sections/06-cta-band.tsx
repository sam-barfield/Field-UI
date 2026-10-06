// title: Call-to-action band
// description: tone="accent" fills the band with the brand colour; buttons invert automatically so they stay visible.
import { Section, Flex, Stack, Heading, Text, Button } from '@sam.barfield/field-react';

export default function CtaBand() {
  return (
    <div className="example-site">
      <Section tone="accent" spacing="md">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="$6">
          <Stack gap="$2">
            <Heading level={2} display="sm">Need a plumber today?</Heading>
            <Text size="lg" tone="secondary">Call before 12pm for a same-day visit.</Text>
          </Stack>
          <Flex gap="$3" wrap="wrap">
            <Button variant="primary" size="lg">Book online</Button>
            <Button variant="outline" size="lg" href="tel:+441170000000">0117 000 0000</Button>
          </Flex>
        </Flex>
      </Section>
    </div>
  );
}
