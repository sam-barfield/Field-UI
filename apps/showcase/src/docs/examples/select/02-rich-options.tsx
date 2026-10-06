// title: Icons, descriptions and disabled options
import { Select } from '@sam.barfield/field-react';
import { Cpu, MemoryStick, Microchip, Zap } from 'lucide-react';

export default function SelectRich() {
  return (
    <div className="example-col">
      <Select
        label="Instance type"
        placeholder="Choose a size"
        helperText="You can resize later."
        options={[
          { value: 't4g.small', label: 't4g.small', description: '2 vCPU · 2 GiB · burstable', icon: <Zap size={14} /> },
          { value: 'c6i.xlarge', label: 'c6i.xlarge', description: '4 vCPU · 8 GiB · compute', icon: <Cpu size={14} /> },
          { value: 'r6i.2xlarge', label: 'r6i.2xlarge', description: '8 vCPU · 64 GiB · memory', icon: <MemoryStick size={14} /> },
          { value: 'p4d', label: 'p4d.24xlarge', description: 'Quota required', icon: <Microchip size={14} />, disabled: true },
        ]}
      />
    </div>
  );
}
