// title: FloatingButton
// description: A button fixed to the bottom-right corner (shown here in the preview frame). BackToTop moves up above it automatically. compactOnMobile keeps only the icon on phones, and badge (here the basket count) stays visible.
import { FloatingButton } from '@sam.barfield/field-react';
import { ShoppingBag } from 'lucide-react';

export default function FloatingButtonExample() {
  return (
    <div className="example-fixed-frame">
      <FloatingButton leftIcon={<ShoppingBag size={18} />} badge={2} compactOnMobile onClick={() => {}}>
        Basket
      </FloatingButton>
    </div>
  );
}
