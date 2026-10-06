// title: Basic
import { useState } from 'react';
import { Select } from '@sam.barfield/field-react';

export default function SelectBasic() {
  const [region, setRegion] = useState('us-east-1');
  return (
    <div className="example-col">
      <Select
        label="Region"
        value={region}
        onChange={setRegion}
        options={[
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-west-1', label: 'Europe (Ireland)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        ]}
      />
    </div>
  );
}
