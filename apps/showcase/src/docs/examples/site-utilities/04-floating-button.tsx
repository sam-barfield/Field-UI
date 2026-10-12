// title: FloatingButton
// description: A button fixed to the bottom-right corner (shown here in the preview frame). BackToTop moves up above it automatically; compactOnMobile keeps only the icon on phones.
import { FloatingButton } from '@sam.barfield/field-react';
import { ShoppingBag } from 'lucide-react';

export default function FloatingButtonExample() {
  return (
    <div className="example-fixed-frame">
      <FloatingButton leftIcon={<ShoppingBag size={18} />} compactOnMobile onClick={() => {}}>
        Basket (2)
      </FloatingButton>
    </div>
  );
}
