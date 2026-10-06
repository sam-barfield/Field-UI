// title: Loading and disabled
// description: isLoading shows a spinner, disables the button and sets aria-busy, which prevents double submits.
import { useState } from 'react';
import { Button } from '@sam.barfield/field-react';

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <>
      <Button variant="primary" isLoading={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
      <Button disabled>Disabled</Button>
    </>
  );
}
