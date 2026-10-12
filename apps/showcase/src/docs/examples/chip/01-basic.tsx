// title: Filter chips with counts
// description: Chips toggle on and off, display item counts, and support default, outline, and accent variants.
import { useState } from 'react';
import { Chip, Flex } from '@sam.barfield/field-react';

export default function ChipBasic() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    all: true,
    photos: false,
    docs: true,
  });

  const toggle = (key: string) => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Flex gap={8} wrap="wrap">
      <Chip selected={selected.all} onSelectedChange={() => toggle('all')} count={42}>
        All records
      </Chip>
      <Chip selected={selected.photos} onSelectedChange={() => toggle('photos')} count={18} variant="outline">
        Photographs
      </Chip>
      <Chip selected={selected.docs} onSelectedChange={() => toggle('docs')} count={24} variant="accent">
        Documents
      </Chip>
      <Chip disabled count={0}>
        Archived
      </Chip>
    </Flex>
  );
}
