// title: Back to top
// description: Rendered on this page: scroll down past 600px and the button appears in the bottom-right corner. Set --field-back-to-top-offset to lift it above a cookie bar.
import { BackToTop, Text } from '@sam.barfield/field-react';

export default function BackToTopExample() {
  return (
    <>
      <Text size="sm" tone="secondary">Scroll the page down to see the button.</Text>
      <BackToTop threshold={600} />
    </>
  );
}
