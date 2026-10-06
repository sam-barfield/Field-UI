// title: With descriptions
import { useState } from 'react';
import { RadioGroup } from '@sam.barfield/field-react';

export default function RadioBasic() {
  const [tenancy, setTenancy] = useState('shared');
  return (
    <div className="example-col">
      <RadioGroup
        label="Tenancy"
        value={tenancy}
        onChange={setTenancy}
        options={[
          { value: 'shared', label: 'Shared', description: 'Runs on shared hardware. Lowest cost.' },
          { value: 'dedicated', label: 'Dedicated instance', description: 'Single-tenant hardware.' },
          { value: 'host', label: 'Dedicated host', description: 'Requires a host reservation.', disabled: true },
        ]}
      />
    </div>
  );
}
