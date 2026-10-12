// title: Horizontal scrolling ChipGroup
// description: ChipGroup arranges chips in a row with touch scrolling on mobile viewports so long lists do not take up excessive vertical space.
import { useState } from 'react';
import { Chip, ChipGroup } from '@sam.barfield/field-react';

const CATEGORIES = [
  { id: 'all', label: 'All', count: 128 },
  { id: '1940s', label: '1940s Era', count: 54 },
  { id: 'aircraft', label: 'Aircraft & Crew', count: 32 },
  { id: 'logbooks', label: 'Logbooks', count: 19 },
  { id: 'letters', label: 'Letters & Diaries', count: 15 },
  { id: 'medals', label: 'Medals & Uniforms', count: 8 },
];

export default function ChipGroupExample() {
  const [active, setActive] = useState('all');

  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 480 }}>
      <ChipGroup scroll gap={8}>
        {CATEGORIES.map(cat => (
          <Chip
            key={cat.id}
            selected={active === cat.id}
            onSelectedChange={() => setActive(cat.id)}
            count={cat.count}
          >
            {cat.label}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
