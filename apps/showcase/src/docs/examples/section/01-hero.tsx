// title: Hero
// description: A Section with a display heading, a lead paragraph and calls to action that stack on phones and sit in a row from 640px.
import { Section, Stack, Flex, Heading, Text, Button, Badge } from '@sam.barfield/field-react';
import { ArrowRight } from 'lucide-react';

export default function SectionHero() {
  return (
    <div className="example-site">
      <Section spacing="xl" container="md">
        <Stack gap="$6" align="center">
          <Badge variant="accent">Now open on Sundays</Badge>
          <Heading level={1} display="lg" align="center">
            Small-batch coffee, roasted round the corner
          </Heading>
          <Text size="xl" tone="secondary" align="center">
            Hearth is a neighbourhood café and roastery on Mill Lane. Fresh bread from 7am, single-origin coffee all day.
          </Text>
          <Flex direction={{ base: 'column', sm: 'row' }} gap="$3" align="center">
            <Button variant="primary" size="lg" href="#/components/section" rightIcon={<ArrowRight size={16} />}>
              See the menu
            </Button>
            <Button variant="outline" size="lg" href="#/components/section">
              Find us
            </Button>
          </Flex>
        </Stack>
      </Section>
    </div>
  );
}
