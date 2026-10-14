// title: Custom controls with FieldLabel and FieldMessage
// description: Build your own control with the same label, required marker, helper and error text as Field's inputs. getFieldDescriptionId gives the id to put in aria-describedby.
import { useId, useState } from 'react';
import { FieldLabel, FieldMessage, getFieldDescriptionId } from '@sam.barfield/field-react';

export default function CustomControl() {
  const id = useId();
  const [colour, setColour] = useState('#2563eb');
  const error = colour.toLowerCase() === '#ffffff' ? 'White would disappear on light backgrounds.' : undefined;
  const helperText = 'Used for buttons and links.';

  return (
    <div className="example-col" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--field-space-1_5)' }}>
      <FieldLabel htmlFor={id} required>
        Brand colour
      </FieldLabel>
      <input
        id={id}
        type="color"
        value={colour}
        onChange={e => setColour(e.target.value)}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={getFieldDescriptionId(id, error, helperText)}
      />
      <FieldMessage id={id} error={error} helperText={helperText} />
    </div>
  );
}
