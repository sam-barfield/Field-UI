// title: Aligning grid cells
// description: align="center" vertically centres copy beside a taller item; switch to a breakpoint object to centre only once the columns sit side by side.
import { Grid, Stack, Heading, Text, AspectRatio } from '@sam.barfield/field-react';

export default function GridAlign() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap="$6" align={{ base: 'stretch', md: 'center' }} className="example-wide">
      <AspectRatio ratio={4 / 3} radius="lg">
        <div style={{ background: 'var(--field-surface-sunken)', width: '100%', height: '100%' }} />
      </AspectRatio>
      <Stack gap="$2">
        <Heading level={3}>Built around your line</Heading>
        <Text tone="secondary">Short copy next to a photo looks unbalanced when it sits at the top of the row.</Text>
      </Stack>
    </Grid>
  );
}
