// title: Testimonials
// description: Quotes marked up as figure / blockquote / figcaption. Swap the Grid for a Carousel when there are more than three.
import { Section, Stack, Grid, Card, Flex, Heading, Text, Avatar } from '@sam.barfield/field-react';

const QUOTES = [
  { name: 'Sarah Whitfield', role: 'Homeowner, Redland', quote: 'Fixed our boiler on Christmas Eve. Polite, quick and the price was exactly as quoted.' },
  { name: 'James Okafor', role: 'Landlord, 14 properties', quote: 'The only firm I trust with my tenants. Reliable, and the paperwork is always in order.' },
  { name: 'Emma Clarke', role: 'Café owner', quote: 'They refitted our kitchen plumbing overnight so we did not lose a day of trading.' },
];

export default function Testimonials() {
  return (
    <div className="example-site">
      <Section>
        <Stack gap="$10">
          <Heading level={2} display="sm" align="center">What our customers say</Heading>
          <Grid columns={{ base: 1, md: 3 }} gap="$5">
            {QUOTES.map(q => (
              <Card key={q.name}>
                <Stack as="figure" gap="$5" style={{ margin: 0, height: '100%', justifyContent: 'space-between' }}>
                  <blockquote style={{ margin: 0 }}>
                    <Text size="lg">“{q.quote}”</Text>
                  </blockquote>
                  <Flex as="figcaption" align="center" gap="$3">
                    <Avatar name={q.name} />
                    <div>
                      <Text size="sm" weight="semibold">{q.name}</Text>
                      <Text size="xs" tone="secondary">{q.role}</Text>
                    </div>
                  </Flex>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </div>
  );
}
