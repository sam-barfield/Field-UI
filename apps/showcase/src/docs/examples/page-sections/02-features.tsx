// title: Feature grid
// description: A section intro followed by a responsive grid of features: one column on phones, two from 640px, three from 1024px.
import { Section, Stack, Grid, Heading, Text } from '@sam.barfield/field-react';
import { Clock, PoundSterling, ShieldCheck, Sparkles, ThumbsUp, Wrench } from 'lucide-react';

const FEATURES = [
  { icon: Clock, title: 'Same-day call-outs', text: 'Book before noon and an engineer arrives the same day.' },
  { icon: PoundSterling, title: 'Fixed, upfront prices', text: 'You approve the price before any work starts.' },
  { icon: ShieldCheck, title: '12-month guarantee', text: 'Every repair is covered for parts and labour.' },
  { icon: Wrench, title: 'All major brands', text: 'Worcester, Vaillant, Baxi, Ideal and more.' },
  { icon: Sparkles, title: 'We tidy up', text: 'Dust sheets down, mess cleared, every time.' },
  { icon: ThumbsUp, title: '4.9 on Google', text: 'Rated by more than 600 local customers.' },
];

export default function FeatureGrid() {
  return (
    <div className="example-site">
      <Section tone="muted">
        <Stack gap={{ base: '$8', md: '$12' }}>
          <Stack gap="$3" style={{ maxWidth: 640 }}>
            <Heading level={2} display="sm">Why customers choose us</Heading>
            <Text size="lg" tone="secondary">Honest advice and tidy work, from the first call to the final invoice.</Text>
          </Stack>
          <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: '$6', md: '$8' }}>
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Stack key={title} gap="$2">
                <Icon size={22} color="var(--field-accent-primary)" aria-hidden="true" />
                <Heading level={3} style={{ fontSize: '1.0625rem' }}>{title}</Heading>
                <Text size="sm" tone="secondary">{text}</Text>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Section>
    </div>
  );
}
