// title: Link cards with pinned footers
// description: fill works on link cards too: cards with href and different text lengths stay equal height, and their footers line up along the bottom of the row.
import { Card, CardContent, CardFooter, Grid, Heading, Text } from '@sam.barfield/field-react';
import { ArrowRight } from 'lucide-react';

const PERIODS = [
  { href: '#/components/card', title: '1941', body: 'The airfield opens as a bomber station.' },
  {
    href: '#/components/card',
    title: '1942 to 1945',
    body: 'No. 51 Squadron flies Halifax bombers from Snaith, followed by No. 578 Squadron. Over 800 airmen who flew from the station did not return.',
  },
  { href: '#/components/card', title: 'Today', body: 'A memorial and museum keep the station records and stories.' },
];

export default function CardLinkFill() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap="$4" className="example-wide">
      {PERIODS.map(period => (
        <Card key={period.title} href={period.href} fill>
          <CardContent>
            <Heading level={4}>{period.title}</Heading>
            <Text size="sm" tone="secondary">{period.body}</Text>
          </CardContent>
          <CardFooter>
            <Text as="span" size="sm" tone="accent" weight="semibold">More information</Text>
            <ArrowRight size={16} aria-hidden="true" />
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );
}
