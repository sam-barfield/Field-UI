// title: Tones
// description: Alternate tones to separate page bands. accent fills with the brand colour and inverts buttons; inverse flips to the opposite light/dark theme.
import { Section, Stack, Flex, Heading, Text, Button } from '@sam.barfield/field-react';

const TONES = [
  { tone: 'default', copy: 'The page background.' },
  { tone: 'muted', copy: 'A subtly darker band for alternating sections.' },
  { tone: 'raised', copy: 'The card surface colour.' },
  { tone: 'accent', copy: 'Your brand colour, for calls to action.' },
  { tone: 'inverse', copy: 'The opposite theme mode, for contrast.' },
] as const;

export default function SectionTones() {
  return (
    <div className="example-site">
      {TONES.map(({ tone, copy }) => (
        <Section key={tone} tone={tone} spacing="sm" container="lg">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="$4">
            <Stack gap="$1">
              <Heading level={3}>tone="{tone}"</Heading>
              <Text size="sm" tone="secondary">{copy}</Text>
            </Stack>
            <Flex gap="$2">
              <Button variant="primary" size="sm">Book a table</Button>
              <Button variant="outline" size="sm">Menu</Button>
            </Flex>
          </Flex>
        </Section>
      ))}
    </div>
  );
}
