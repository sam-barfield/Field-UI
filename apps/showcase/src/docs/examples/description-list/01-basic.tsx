// title: Responsive metadata list
// description: DescriptionList formats semantic key-value terms (<dl>, <dt>, <dd>) with responsive columns and dividers.
import { DescriptionList, DescriptionItem, Badge } from '@sam.barfield/field-react';

export default function DescriptionListBasic() {
  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 640 }}>
      <DescriptionList columns={{ base: 1, sm: 2 }} divided>
        <DescriptionItem label="Aircraft Type">Halifax B.Mk.III</DescriptionItem>
        <DescriptionItem label="Serial Number">MZ311 / QO-X</DescriptionItem>
        <DescriptionItem label="Squadron">51 Squadron, RAF</DescriptionItem>
        <DescriptionItem label="Status">
          <Badge variant="success" dot>Preserved Artifact</Badge>
        </DescriptionItem>
        <DescriptionItem label="Location">RAF Snaith Memorial, East Yorkshire</DescriptionItem>
        <DescriptionItem label="Catalog ID">SN-1944-0824</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
