// title: Required with an error
// description: error shows a message under the checkbox and marks it invalid for assistive tech.
import { useState } from 'react';
import { Button, Checkbox } from '@sam.barfield/field-react';

export default function CheckboxError() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="example-col">
      <Checkbox
        required
        label="I agree to the terms of service"
        checked={accepted}
        onChange={setAccepted}
        error={submitted && !accepted ? 'Accept the terms to continue.' : undefined}
      />
      <Button variant="primary" onClick={() => setSubmitted(true)}>
        Continue
      </Button>
    </div>
  );
}
