// title: Sizes and tones
// description: size sets the width (sm, md, lg); tone="neutral" uses a quiet month strip, e.g. for past events.
import { DateTile, Flex } from '@sam.barfield/field-react';

export default function DateTileSizes() {
  return (
    <Flex gap="$4" align="end" wrap="wrap">
      <DateTile date="2026-11-08" size="sm" />
      <DateTile date="2026-11-08" />
      <DateTile date="2026-11-08" size="lg" />
      <DateTile date="2026-03-14" tone="neutral" />
      <DateTile date="2026-03-14" tone="neutral" size="lg" />
    </Flex>
  );
}
