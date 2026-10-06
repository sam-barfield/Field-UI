// title: Basic, description and disabled
import { Checkbox } from '@sam.barfield/field-react';

export default function CheckboxBasic() {
  return (
    <div className="example-col">
      <Checkbox label="Enable detailed monitoring" defaultChecked />
      <Checkbox label="Encrypt volume" description="Uses your default KMS key. Slightly increases latency." />
      <Checkbox label="Termination protection" disabled />
    </div>
  );
}
