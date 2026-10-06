// title: Hero headline
// description: The animation replays when you remount it. Screen readers always get the full text, and reduced motion skips the animation.
import { useState } from 'react';
import { UnfoldingHeading, Button, Stack } from '@sam.barfield/field-react';

export default function UnfoldingBasic() {
  const [key, setKey] = useState(0);
  return (
    <Stack gap={20} align="center">
      <UnfoldingHeading key={key} as="h2" size="xl" text="Ship infrastructure faster" highlightWords={['faster']} intensity="medium" />
      <Button size="sm" onClick={() => setKey(k => k + 1)}>Replay</Button>
    </Stack>
  );
}
