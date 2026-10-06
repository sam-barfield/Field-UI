// title: Label, helper text and required
import { TextInput } from '@sam.barfield/field-react';

export default function TextInputBasic() {
  return (
    <div className="example-col">
      <TextInput label="Project name" placeholder="my-project" required helperText="Lowercase letters, numbers and dashes." />
      <TextInput label="Email" type="email" placeholder="you@company.com" autoComplete="email" />
    </div>
  );
}
