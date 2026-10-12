// title: Grid fill and inset variant
// description: Set fill on Card inside a grid so every card stretches to 100% height with pinned footers. Use variant="inset" for sunken nested cards.
import { Card, CardHeader, CardContent, CardFooter, Grid, Heading, Text, Button } from '@sam.barfield/field-react';

export default function CardFillAndInset() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap={16} style={{ width: '100%', maxWidth: 640 }}>
      <Card fill>
        <CardHeader>
          <Heading level={4}>Standard Card</Heading>
        </CardHeader>
        <CardContent>
          <Text size="sm" tone="secondary">
            Short description here. Notice the card expands to match its sibling height, and the footer stays pinned at the bottom.
          </Text>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">Action</Button>
        </CardFooter>
      </Card>

      <Card fill variant="inset">
        <CardHeader>
          <Heading level={4}>Inset Variant</Heading>
        </CardHeader>
        <CardContent>
          <Text size="sm" tone="secondary">
            Sunken background tone with subtle border, ideal for grouping nested settings or secondary specs.
          </Text>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="ghost">Details</Button>
        </CardFooter>
      </Card>
    </Grid>
  );
}
