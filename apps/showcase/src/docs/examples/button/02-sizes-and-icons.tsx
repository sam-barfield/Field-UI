// title: Sizes and icons
// description: sm (30px), md (36px), lg (44px) and xl (48px). Icons from any library go in leftIcon / rightIcon.
import { Button } from '@sam.barfield/field-react';
import { ArrowRight, Plus } from 'lucide-react';

export default function ButtonSizes() {
  return (
    <>
      <Button size="sm" leftIcon={<Plus size={14} />}>Small</Button>
      <Button size="md" leftIcon={<Plus size={16} />}>Medium</Button>
      <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />}>
        Large
      </Button>
      <Button size="xl" variant="primary" rightIcon={<ArrowRight size={20} />}>
        Extra Large
      </Button>
    </>
  );
}
