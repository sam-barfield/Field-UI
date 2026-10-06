// title: Multi-select with search
import { useState } from 'react';
import { Combobox } from '@sam.barfield/field-react';

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-east-2', label: 'us-east-2' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-west-1', label: 'eu-west-1' },
  { value: 'eu-central-1', label: 'eu-central-1' },
  { value: 'ap-southeast-1', label: 'ap-southeast-1' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1', disabled: true },
];

export default function ComboboxBasic() {
  const [regions, setRegions] = useState(['us-east-1', 'eu-west-1']);
  return (
    <div className="example-col">
      <Combobox
        label="Replicate to regions"
        options={REGIONS}
        value={regions}
        onChange={setRegions}
        placeholder="Search regions…"
        helperText={`${regions.length} selected`}
      />
    </div>
  );
}
