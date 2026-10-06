// title: Right-click menu
// description: Right-click the box, or focus it and press Shift+F10.
import { ContextMenu, useToast } from '@sam.barfield/field-react';
import { Copy, Download, Trash2 } from 'lucide-react';

export default function ContextMenuBasic() {
  const { showToast } = useToast();
  return (
    <ContextMenu
      items={[
        { id: 'copy', label: 'Copy link', icon: <Copy size={14} />, shortcut: '⌘C', onSelect: () => showToast({ title: 'Link copied' }) },
        { id: 'download', label: 'Download', icon: <Download size={14} />, onSelect: () => showToast({ title: 'Downloading…' }) },
        { id: 'div', label: '', divider: true },
        { id: 'delete', label: 'Delete', icon: <Trash2 size={14} />, variant: 'danger', onSelect: () => showToast({ title: 'Deleted', variant: 'danger' }) },
      ]}
    >
      <div
        tabIndex={0}
        style={{
          padding: '40px 56px',
          border: '1px dashed var(--field-border-strong)',
          borderRadius: 'var(--field-radius-lg)',
          color: 'var(--field-text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        Right-click anywhere in this box
      </div>
    </ContextMenu>
  );
}
