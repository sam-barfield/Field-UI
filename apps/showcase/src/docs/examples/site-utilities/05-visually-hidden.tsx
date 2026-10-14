// title: VisuallyHidden
// description: Text for screen readers only, e.g. to say which page is current or what an icon-only link does. below="sm" hides it on phones only, so a label can shrink to its icon on small screens.
import { Button, Flex, Link, VisuallyHidden } from '@sam.barfield/field-react';
import { ShoppingBag } from 'lucide-react';

export default function VisuallyHiddenExample() {
  return (
    <Flex gap="$4" align="center" wrap="wrap">
      <Link href="#/components/site-utilities">
        Events<VisuallyHidden> (current page)</VisuallyHidden>
      </Link>
      <Button variant="secondary" leftIcon={<ShoppingBag size={16} aria-hidden="true" />}>
        <VisuallyHidden below="sm">Basket (2 items)</VisuallyHidden>
      </Button>
    </Flex>
  );
}
