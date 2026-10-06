// title: Split hero
// description: Copy and an image side by side from 768px, stacked on phones. Load hero images eagerly since they are above the fold.
import { Section, Grid, Stack, Flex, Heading, Text, Button, Image } from '@sam.barfield/field-react';
import { Phone } from 'lucide-react';

export default function SplitHero() {
  return (
    <div className="example-site">
      <Section spacing="lg">
        <Grid columns={{ base: 1, md: 2 }} gap={{ base: '$8', lg: '$16' }} style={{ alignItems: 'center' }}>
          <Stack gap="$5">
            <Text size="sm" weight="semibold" tone="accent">Gas Safe registered · 24/7 call-outs</Text>
            <Heading level={1} display="md">Boiler broken? We will be there today.</Heading>
            <Text size="xl" tone="secondary">
              Family-run plumbing and heating across North Bristol for over 20 years. Fixed prices, no call-out fee.
            </Text>
            <Flex direction={{ base: 'column', sm: 'row' }} gap="$3">
              <Button variant="primary" size="lg" leftIcon={<Phone size={16} />} href="tel:+441170000000">
                0117 000 0000
              </Button>
              <Button variant="outline" size="lg">Get a free quote</Button>
            </Flex>
          </Stack>
          <Image src="https://picsum.photos/seed/field-trades/1000/800" alt="Sample photo" ratio={5 / 4} radius="lg" loading="eager" />
        </Grid>
      </Section>
    </div>
  );
}
