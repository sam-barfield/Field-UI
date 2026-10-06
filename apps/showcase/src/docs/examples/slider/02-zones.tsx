// title: Threshold zones
// description: Zones colour the track and show a label for the current range - ideal for alert thresholds.
import { useState } from 'react';
import { Slider } from '@sam.barfield/field-react';

export default function SliderZones() {
  const [cpu, setCpu] = useState(72);
  return (
    <div className="example-col">
      <Slider
        label="CPU alarm threshold"
        value={cpu}
        onChange={setCpu}
        valueSuffix="%"
        showMarks
        glow
        zones={[
          { to: 60, color: 'success', label: 'Healthy' },
          { to: 85, color: 'warning', label: 'Elevated' },
          { to: 100, color: 'danger', label: 'Critical' },
        ]}
      />
    </div>
  );
}
