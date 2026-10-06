// title: Min, max, step and unit
// description: Type freely; the value is clamped and rounded to the step on blur or Enter.
import { useState } from 'react';
import { NumberInput } from '@sam.barfield/field-react';

export default function NumberInputBasic() {
  const [count, setCount] = useState(3);
  return (
    <div className="example-col">
      <NumberInput label="Instances" min={1} max={20} value={count} onChange={setCount} helperText="Between 1 and 20." />
      <NumberInput label="Volume size" unit="GB" min={8} max={16384} step={8} defaultValue={64} />
      <NumberInput label="CPU credits" step={0.25} min={0} defaultValue={1.5} />
    </div>
  );
}
