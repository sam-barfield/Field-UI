// title: Icon
// description: A sized, theme-coloured icon. Decorative by default; pass label when the icon alone carries the meaning.
import { Flex, Icon, Text } from '@sam.barfield/field-react';
import { AlertTriangle, CheckCircle2, Plane, Star } from 'lucide-react';

export default function IconExample() {
  return (
    <Flex direction="column" gap="$3">
      <Flex align="center" gap="$4">
        <Icon icon={Plane} size="sm" tone="accent" />
        <Icon icon={Plane} size="md" tone="accent" />
        <Icon icon={Plane} size="lg" tone="accent" />
        <Icon icon={Plane} size="xl" tone="accent" />
      </Flex>
      <Flex align="center" gap="$4">
        <Icon icon={CheckCircle2} tone="success" label="Open today" />
        <Icon icon={AlertTriangle} tone="warning" label="Limited parking" />
        <Icon icon={Star} tone="secondary" />
      </Flex>
      <Text>
        <Icon icon={Plane} size="sm" tone="accent" inline /> Flights from Snaith ran from 1941 to 1945.
      </Text>
    </Flex>
  );
}
