// title: As a page heading
// description: titleAs="h1" makes the title the page's main heading, e.g. on a 404 page.
import { EmptyState, Button } from '@sam.barfield/field-react';
import { MapPinOff } from 'lucide-react';

export default function EmptyStatePageHeading() {
  return (
    <div className="example-col" style={{ maxWidth: 520 }}>
      <EmptyState
        titleAs="h1"
        icon={<MapPinOff size={22} />}
        title="Page not found"
        description="The page may have moved. Try the homepage or get in touch."
        action={<Button href="#/" variant="primary">Back to home</Button>}
      />
    </div>
  );
}
