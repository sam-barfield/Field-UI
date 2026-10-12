// title: Divided
// description: Parts that share one card, separated by hairlines. They stack on phones and sit side by side from 768px (direction accepts a breakpoint object).
import { Card, Divided, Stack, Text } from '@sam.barfield/field-react';

const PARTS = [
  { title: 'Opening hours', body: 'Sundays and bank holidays, 10:00 to 16:00, April to October.' },
  { title: 'Admission', body: 'Free entry. Donations help keep the collection open.' },
  { title: 'Getting here', body: 'Free parking on site. Ten minutes from junction 34 of the M62.' },
];

export default function DividedExample() {
  return (
    <Card className="example-wide">
      <Divided direction={{ base: 'column', md: 'row' }}>
        {PARTS.map(part => (
          <Stack key={part.title} gap="$1">
            <Text weight="semibold">{part.title}</Text>
            <Text size="sm" tone="secondary">{part.body}</Text>
          </Stack>
        ))}
      </Divided>
    </Card>
  );
}
