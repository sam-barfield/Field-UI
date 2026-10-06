// title: Responsive Grid
// description: minChildWidth fits as many columns as possible - resize the window to see it reflow.
import { Grid, Card, Text } from '@sam.barfield/field-react';

export default function GridResponsive() {
  return (
    <Grid minChildWidth={160} gap={12} className="example-wide">
      {['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-south-1', 'sa-east-1'].map(region => (
        <Card key={region} padding="sm">
          <Text size="sm" weight="semibold" mono>{region}</Text>
          <Text size="xs" tone="secondary">12 instances</Text>
        </Card>
      ))}
    </Grid>
  );
}
