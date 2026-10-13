// title: Divided with breakpoint spacing and a 60/40 split
// description: space accepts a breakpoint object (24px between the stacked parts, 32px either side of the line once they sit side by side) and columns sets the widths while side by side.
import { Button, Card, Divided, Heading, Stack, Text } from '@sam.barfield/field-react';

export default function DividedSplit() {
  return (
    <Card className="example-wide">
      <Divided direction={{ base: 'column', md: 'row' }} space={{ base: '$6', md: '$8' }} columns="3fr 2fr">
        <Stack gap="$2">
          <Heading level={3}>No events scheduled</Heading>
          <Text tone="secondary">
            Our next open days will be announced here. The museum is still open every Sunday from April to October.
          </Text>
        </Stack>
        <Stack gap="$3" align="start">
          <Text size="sm" weight="semibold">Hear about new events first</Text>
          <Button variant="outline">Join the mailing list</Button>
        </Stack>
      </Divided>
    </Card>
  );
}
