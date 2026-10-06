// title: Uncontrolled in a form
// description: With name, values are submitted as local YYYY-MM-DD strings - no timezone surprises.
import { useState } from 'react';
import { DatePicker, Button } from '@sam.barfield/field-react';

export default function DatePickerForm() {
  const [result, setResult] = useState('');
  return (
    <form
      className="example-col"
      onSubmit={e => {
        e.preventDefault();
        setResult(String(new FormData(e.currentTarget).get('launch') || '(empty)'));
      }}
    >
      <DatePicker name="launch" label="Launch date" defaultValue={new Date()} />
      <Button type="submit" variant="primary">Submit</Button>
      {result && <code>launch={result}</code>}
    </form>
  );
}
