// title: Validation
// description: error replaces the helper text, sets aria-invalid and is announced to screen readers.
import { useState } from 'react';
import { TextInput, TextArea } from '@sam.barfield/field-react';

export default function TextInputValidation() {
  const [name, setName] = useState('My Bucket');
  const error = /^[a-z0-9-]+$/.test(name) ? undefined : 'Use lowercase letters, numbers and dashes only.';

  return (
    <div className="example-col">
      <TextInput
        label="Bucket name"
        value={name}
        onChange={e => setName(e.target.value)}
        error={error}
        helperText="Must be globally unique."
      />
      <TextArea label="Description" rows={3} placeholder="What is this bucket for?" maxLength={200} />
      <TextInput label="Region" value="us-east-1" disabled />
    </div>
  );
}
