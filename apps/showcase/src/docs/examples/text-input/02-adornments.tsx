// title: Adornments
// description: Put icons, units or buttons inside the field.
import { useState } from 'react';
import { TextInput, IconButton } from '@sam.barfield/field-react';
import { Eye, EyeOff, Search } from 'lucide-react';

export default function TextInputAdornments() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="example-col">
      <TextInput aria-label="Search" placeholder="Search instances…" leftAdornment={<Search size={15} />} />
      <TextInput label="Storage" type="number" defaultValue={100} rightAdornment="GB" />
      <TextInput
        label="API secret"
        type={visible ? 'text' : 'password'}
        defaultValue="sk_live_51H8…"
        rightAdornment={
          <IconButton
            size="sm"
            variant="ghost"
            icon={visible ? <EyeOff size={14} /> : <Eye size={14} />}
            aria-label={visible ? 'Hide secret' : 'Show secret'}
            onClick={() => setVisible(v => !v)}
          />
        }
      />
    </div>
  );
}
