// title: Basic
import { useState } from 'react';
import { Slider } from '@sam.barfield/field-react';

export default function SliderBasic() {
  const [value, setValue] = useState(40);
  return (
    <div className="example-col">
      <Slider label="Traffic to canary" value={value} onChange={setValue} valueSuffix="%" step={5} />
    </div>
  );
}
