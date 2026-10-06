// title: ⌘K command palette
// description: Press ⌘K / Ctrl+K anywhere on this page, or use the button. Items are grouped by category and searchable by keywords.
import { useState } from 'react';
import { CommandPalette, Button, Kbd, useToast, useTheme, type CommandItemData } from '@sam.barfield/field-react';
import { FileText, Moon, Plus, Search, Server } from 'lucide-react';

export default function CommandPaletteBasic() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const { toggleMode } = useTheme();

  const items: CommandItemData[] = [
    { id: 'instances', title: 'Go to instances', category: 'Navigation', icon: <Server size={15} />, shortcut: 'G I', onSelect: () => showToast({ title: 'Instances' }) },
    { id: 'docs', title: 'Open documentation', category: 'Navigation', icon: <FileText size={15} />, keywords: ['help', 'guide'], onSelect: () => (window.location.hash = '#/docs/introduction') },
    { id: 'new', title: 'Create instance', category: 'Actions', icon: <Plus size={15} />, description: 'Launch a new virtual machine', onSelect: () => showToast({ title: 'Launching…' }) },
    { id: 'theme', title: 'Toggle dark mode', category: 'Preferences', icon: <Moon size={15} />, keywords: ['light', 'theme'], onSelect: toggleMode },
  ];

  return (
    <>
      <Button leftIcon={<Search size={14} />} onClick={() => setOpen(true)}>
        Search <Kbd>⌘K</Kbd>
      </Button>
      <CommandPalette isOpen={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} items={items} />
    </>
  );
}
