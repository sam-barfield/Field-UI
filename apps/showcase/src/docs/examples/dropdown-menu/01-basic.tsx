// title: Row actions
// description: Groups, shortcuts, a divider and a destructive item. Try it with the keyboard: Enter to open, arrows to move, Esc to close.
import { DropdownMenu, DropdownItem, DropdownGroup, DropdownDivider, IconButton, useToast } from '@sam.barfield/field-react';
import { Copy, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react';

export default function DropdownBasic() {
  const { showToast } = useToast();
  const notify = (title: string) => showToast({ title });

  return (
    <DropdownMenu
      align="end"
      trigger={<IconButton icon={<MoreHorizontal size={16} />} aria-label="Instance actions" variant="ghost" />}
    >
      <DropdownGroup label="Instance">
        <DropdownItem icon={<Pencil size={14} />} shortcut="R" onSelect={() => notify('Rename')}>
          Rename
        </DropdownItem>
        <DropdownItem icon={<Copy size={14} />} shortcut="⌘D" onSelect={() => notify('Duplicated')}>
          Duplicate
        </DropdownItem>
        <DropdownItem icon={<Power size={14} />} disabled>
          Stop (already stopped)
        </DropdownItem>
      </DropdownGroup>
      <DropdownDivider />
      <DropdownItem icon={<Trash2 size={14} />} variant="danger" onSelect={() => notify('Terminated')}>
        Terminate
      </DropdownItem>
    </DropdownMenu>
  );
}
