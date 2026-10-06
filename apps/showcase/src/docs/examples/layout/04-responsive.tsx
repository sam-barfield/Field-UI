// title: Responsive props
// description: Layout props accept a breakpoint object, mobile first: base applies everywhere, then sm (640px), md (768px), lg (1024px) and xl (1280px) override upwards. hideBelow / hideFrom show content only on larger or smaller screens. Resize the window to see it change.
import { Flex, Grid, Stack, Box, Card, Text, Badge } from '@sam.barfield/field-react';

export default function ResponsiveLayout() {
  return (
    <Stack gap="$6" className="example-wide">
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '$3', md: '$6' }} align={{ base: 'stretch', md: 'center' }}>
        <Card padding="sm" style={{ flex: 1 }}><Text size="sm">direction=&#123;&#123; base: 'column', md: 'row' &#125;&#125;</Text></Card>
        <Card padding="sm" style={{ flex: 1 }}><Text size="sm">Stacks on phones</Text></Card>
        <Card padding="sm" style={{ flex: 1 }}><Text size="sm">Row from 768px</Text></Card>
      </Flex>
      <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap="$3">
        {['1 column', '2 from sm', '4 from lg', 'columns={…}'].map(label => (
          <Card key={label} padding="sm"><Text size="sm">{label}</Text></Card>
        ))}
      </Grid>
      <Flex gap="$2" wrap="wrap">
        <Box hideFrom="md"><Badge variant="info">Visible below 768px</Badge></Box>
        <Box hideBelow="md"><Badge variant="success">Visible from 768px</Badge></Box>
      </Flex>
    </Stack>
  );
}
