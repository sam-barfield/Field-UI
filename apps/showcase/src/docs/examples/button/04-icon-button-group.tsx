// title: IconButton and ButtonGroup
// description: IconButton requires an aria-label. ButtonGroup joins related buttons; set attached={false} for a spaced toolbar.
import { ButtonGroup, Button, IconButton, Tooltip } from '@sam.barfield/field-react';
import { AlignCenter, AlignLeft, AlignRight, RefreshCw, Trash2 } from 'lucide-react';

export default function IconButtons() {
  return (
    <>
      <ButtonGroup aria-label="Text alignment">
        <IconButton icon={<AlignLeft size={16} />} aria-label="Align left" />
        <IconButton icon={<AlignCenter size={16} />} aria-label="Align center" />
        <IconButton icon={<AlignRight size={16} />} aria-label="Align right" />
      </ButtonGroup>

      <ButtonGroup attached={false}>
        <Tooltip content="Refresh">
          <IconButton icon={<RefreshCw size={16} />} aria-label="Refresh" variant="ghost" />
        </Tooltip>
        <Tooltip content="Delete">
          <IconButton icon={<Trash2 size={16} />} aria-label="Delete" variant="danger" />
        </Tooltip>
        <Button variant="outline">Details</Button>
      </ButtonGroup>
    </>
  );
}
