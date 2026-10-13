// title: Scroll on phones, wrap on wider screens
// description: scroll accepts a breakpoint object. Here the chips stay on one swipeable row below 768px and wrap onto more rows from 768px.
import { useState } from 'react';
import { Chip, ChipGroup } from '@sam.barfield/field-react';

const CATEGORIES = ['All', 'Prints', 'Books', 'Models', 'Clothing', 'Badges & patches', 'Gift vouchers'];

export default function ChipGroupResponsiveScroll() {
  const [active, setActive] = useState('All');

  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 560 }}>
      <ChipGroup scroll={{ base: true, md: false }}>
        {CATEGORIES.map(category => (
          <Chip key={category} selected={active === category} onSelectedChange={() => setActive(category)}>
            {category}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
