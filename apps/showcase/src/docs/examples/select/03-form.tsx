// title: In a native form
// description: With name, the value is submitted with the form. error and required work like TextInput.
import { useState } from 'react';
import { Select, Button } from '@sam.barfield/field-react';

export default function SelectForm() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  return (
    <form
      className="example-col"
      onSubmit={e => {
        e.preventDefault();
        const plan = new FormData(e.currentTarget).get('plan') as string;
        setError(plan ? undefined : 'Choose a plan to continue.');
        setSubmitted(plan || null);
      }}
    >
      <Select
        name="plan"
        label="Plan"
        required
        error={error}
        options={[
          { value: 'hobby', label: 'Hobby - free' },
          { value: 'pro', label: 'Pro - $20 / month' },
          { value: 'team', label: 'Team - $80 / month' },
        ]}
      />
      <Button type="submit" variant="primary">Continue</Button>
      {submitted && <span>Submitted plan: {submitted}</span>}
    </form>
  );
}
