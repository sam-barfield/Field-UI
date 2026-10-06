// title: CodeBlock
// description: Line numbers, highlighted lines, a title and a copy button.
import { CodeBlock } from '@sam.barfield/field-react';

const CODE = `import { Button } from '@sam.barfield/field-react';

export function Save() {
  return <Button variant="primary">Save</Button>;
}`;

export default function CodeBlockExample() {
  return (
    <div className="example-wide">
      <CodeBlock code={CODE} language="tsx" title="Save.tsx" highlightLines={[4]} />
    </div>
  );
}
