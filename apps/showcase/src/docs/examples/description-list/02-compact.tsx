// title: Compact density
// description: Set density="compact" to reduce spacing for dense administrative panels and sidebar inspectors.
import { DescriptionList, DescriptionItem } from '@sam.barfield/field-react';

export default function DescriptionListCompact() {
  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 560 }}>
      <DescriptionList density="compact" divided>
        <DescriptionItem label="Flight Plan">Snaith to Ruhr Valley</DescriptionItem>
        <DescriptionItem label="Departure Time">21:45 BST</DescriptionItem>
        <DescriptionItem label="Fuel Load">1,980 Imperial Gallons</DescriptionItem>
        <DescriptionItem label="Crew Complement">7 Personnel</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
