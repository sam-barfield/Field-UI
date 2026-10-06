// title: Reveal on scroll
// description: Content below the fold fades in as it enters the viewport; stagger with delay. Nothing is hidden for reduced-motion users or before JavaScript runs.
import { Reveal, Grid, Card, Heading, Text } from '@sam.barfield/field-react';
import { Coffee, Croissant, Truck } from 'lucide-react';

const FEATURES = [
  { icon: <Coffee size={20} />, title: 'Roasted on site', text: 'Every bean roasted within a week of brewing.' },
  { icon: <Croissant size={20} />, title: 'Baked at dawn', text: 'Bread and pastries from our own ovens daily.' },
  { icon: <Truck size={20} />, title: 'Local delivery', text: 'Wholesale orders delivered by 9am.' },
];

export default function RevealExample() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap="$4" className="example-wide">
      {FEATURES.map((f, i) => (
        <Reveal key={f.title} delay={i * 120}>
          <Card>
            <div style={{ color: 'var(--field-accent-primary)', marginBottom: 12 }}>{f.icon}</div>
            <Heading level={4}>{f.title}</Heading>
            <Text size="sm" tone="secondary">{f.text}</Text>
          </Card>
        </Reveal>
      ))}
    </Grid>
  );
}
