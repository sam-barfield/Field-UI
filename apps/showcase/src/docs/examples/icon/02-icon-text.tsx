// title: IconText
// description: An icon beside a block of text, aligned with the first line. Good for addresses, opening hours and feature lists.
import { IconText, Stack, Text } from '@sam.barfield/field-react';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function IconTextExample() {
  return (
    <Stack gap="$4" className="example-col">
      <IconText icon={MapPin}>
        <Text weight="semibold">RAF Snaith Museum</Text>
        <Text size="sm" tone="secondary">Pollington, East Yorkshire, DN14 0DJ</Text>
      </IconText>
      <IconText icon={Clock}>
        <Text weight="semibold">Sundays, 10:00 to 16:00</Text>
        <Text size="sm" tone="secondary">April to October, and bank holidays</Text>
      </IconText>
      <IconText icon={Phone} align="center">
        <Text>01405 000000</Text>
      </IconText>
    </Stack>
  );
}
