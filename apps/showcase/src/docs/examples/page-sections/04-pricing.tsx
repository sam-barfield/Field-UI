// title: Pricing
// description: Plan cards with a highlighted tier. Lists use real <ul> markup; the featured card is marked with a badge rather than colour alone.
import { Section, Stack, Grid, Card, Flex, Heading, Text, Button, Badge, Divider } from '@sam.barfield/field-react';
import { Check } from 'lucide-react';

const PLANS = [
  { name: 'Essentials', price: '£12', blurb: 'For a single boiler', features: ['Annual service', 'Gas safety certificate', '10% off repairs'] },
  { name: 'Complete', price: '£19', blurb: 'Most homes choose this', featured: true, features: ['Everything in Essentials', 'Unlimited call-outs', 'Parts and labour covered', 'Priority booking'] },
  { name: 'Landlord', price: '£29', blurb: 'Per property', features: ['Everything in Complete', 'Tenant liaison', 'Compliance reminders'] },
];

export default function Pricing() {
  return (
    <div className="example-site">
      <Section tone="muted">
        <Stack gap="$10">
          <Stack gap="$3" align="center">
            <Heading level={2} display="sm" align="center">Boiler cover plans</Heading>
            <Text size="lg" tone="secondary" align="center">Monthly, cancel any time.</Text>
          </Stack>
          <Grid columns={{ base: 1, md: 3 }} gap="$5" style={{ alignItems: 'start' }}>
            {PLANS.map(plan => (
              <Card key={plan.name} padding="lg" style={plan.featured ? { borderColor: 'var(--field-accent-primary)', borderWidth: 2 } : undefined}>
                <Stack gap="$4">
                  <Flex justify="space-between" align="center">
                    <Heading level={3}>{plan.name}</Heading>
                    {plan.featured && <Badge variant="accent">Most popular</Badge>}
                  </Flex>
                  <div>
                    <Text as="span" style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em' }}>{plan.price}</Text>
                    <Text as="span" tone="secondary"> / month</Text>
                    <Text size="sm" tone="secondary">{plan.blurb}</Text>
                  </div>
                  <Button variant={plan.featured ? 'primary' : 'outline'} isFullWidth>Choose {plan.name}</Button>
                  <Divider />
                  <Stack as="ul" gap="$2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {plan.features.map(f => (
                      <Flex as="li" key={f} gap="$2" align="flex-start">
                        <Check size={16} color="var(--field-status-success-base)" aria-hidden="true" style={{ marginTop: 3, flexShrink: 0 }} />
                        <Text size="sm">{f}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </div>
  );
}
