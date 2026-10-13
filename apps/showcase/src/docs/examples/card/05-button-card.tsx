// title: Selectable cards
// description: as="button" renders a real <button> (type="button", reachable with the keyboard) without the browser's button font, colour, alignment or width. aria-pressed marks the selected card.
import { useState } from 'react';
import { Card, Grid, Heading, Text } from '@sam.barfield/field-react';

const ALBUMS = [
  { id: 'aircraft', title: 'Aircraft', count: 42 },
  { id: 'crews', title: 'Crews', count: 118 },
  { id: 'station', title: 'The station', count: 27 },
];

export default function CardButton() {
  const [selected, setSelected] = useState('aircraft');

  return (
    <Grid columns={{ base: 1, sm: 3 }} gap="$3" className="example-wide">
      {ALBUMS.map(album => (
        <Card
          key={album.id}
          as="button"
          type="button"
          fill
          aria-pressed={selected === album.id}
          onClick={() => setSelected(album.id)}
        >
          <Heading level={4}>{album.title}</Heading>
          <Text size="sm" tone="secondary">{album.count} photos</Text>
        </Card>
      ))}
    </Grid>
  );
}
