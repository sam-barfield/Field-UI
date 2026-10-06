// title: Horizontal
import { RadioGroup } from '@sam.barfield/field-react';

export default function RadioHorizontal() {
  return (
    <RadioGroup
      label="Billing"
      orientation="horizontal"
      defaultValue="monthly"
      options={[
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly (save 20%)' },
      ]}
    />
  );
}
