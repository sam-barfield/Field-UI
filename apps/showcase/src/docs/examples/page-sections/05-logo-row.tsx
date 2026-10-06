// title: Logo row
// description: "As seen in" / accreditation strip. Use real logo images with alt text naming the organisation; text stands in here.
import { Section, Stack, Flex, Text } from '@sam.barfield/field-react';

const LOGOS = ['Gas Safe', 'Which? Trusted', 'Checkatrade', 'NICEIC', 'TrustMark'];

export default function LogoRow() {
  return (
    <div className="example-site">
      <Section spacing="sm">
        <Stack gap="$5" align="center">
          <Text size="sm" tone="tertiary" align="center">Accredited and trusted by</Text>
          <Flex as="ul" wrap="wrap" justify="center" gap={{ base: '$6', md: '$12' }} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {LOGOS.map(name => (
              <li key={name}>
                <Text weight="bold" tone="secondary" style={{ fontSize: '1.125rem', letterSpacing: '-0.02em', opacity: 0.8 }}>
                  {name}
                </Text>
              </li>
            ))}
          </Flex>
        </Stack>
      </Section>
    </div>
  );
}
