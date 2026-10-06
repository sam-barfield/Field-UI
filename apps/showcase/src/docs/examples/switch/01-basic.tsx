// title: Settings list
// description: Switches apply immediately; onChange receives the new boolean.
import { useState } from 'react';
import { Switch, Stack, useToast } from '@sam.barfield/field-react';

export default function SwitchBasic() {
  const [autoscale, setAutoscale] = useState(true);
  const { showToast } = useToast();

  return (
    <Stack gap={16} className="example-col">
      <Switch
        label="Auto-scaling"
        description="Add capacity automatically when CPU stays above 70%."
        checked={autoscale}
        onChange={on => {
          setAutoscale(on);
          showToast({ title: on ? 'Auto-scaling enabled' : 'Auto-scaling disabled', variant: on ? 'success' : 'info' });
        }}
      />
      <Switch label="Maintenance mode" />
      <Switch label="Delete protection" defaultChecked disabled />
    </Stack>
  );
}
