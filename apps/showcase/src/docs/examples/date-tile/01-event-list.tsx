// title: Event dates
// description: The tile shows the month and day; put the weekday and time beside it as text. Screen readers hear the full date ("Sunday 8 November 2026"). A range in one month shows both days; across months the tile keeps the start day and the text gives the range.
import { DateTile, Flex, Stack, Text } from '@sam.barfield/field-react';

const EVENTS = [
  { date: '2026-11-08', title: 'Remembrance Sunday service', when: 'Sunday · 10:45am' },
  { date: '2026-11-21', endDate: '2026-11-22', title: 'Winter open weekend', when: 'Saturday and Sunday · 10am – 4pm' },
  { date: '2026-12-30', endDate: '2027-01-02', title: 'New Year workshop', when: '30 Dec – 2 Jan · 11am daily' },
];

export default function DateTileEventList() {
  return (
    <Stack gap="$4" className="example-col">
      {EVENTS.map(event => (
        <Flex key={event.title} gap="$3" align="center">
          <DateTile date={event.date} endDate={event.endDate} />
          <Stack gap="$1">
            <Text weight="semibold">{event.title}</Text>
            <Text size="sm" tone="secondary">{event.when}</Text>
          </Stack>
        </Flex>
      ))}
    </Stack>
  );
}
