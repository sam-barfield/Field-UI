// title: Variants
// description: Use one primary button for the main action in a view; secondary and outline for alternatives; ghost in toolbars; link for inline text actions; danger for destructive actions.
import { Button } from '@sam.barfield/field-react';

export default function ButtonVariants() {
  return (
    <>
      <Button variant="primary">Deploy</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">Export</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="link">Documentation</Button>
      <Button variant="danger">Delete</Button>
    </>
  );
}
