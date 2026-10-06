// title: File browser
// description: Click to select, use the chevrons to expand - or focus the tree and use the arrow keys.
import { useState } from 'react';
import { TreeView, type TreeNode } from '@sam.barfield/field-react';

const TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'components', label: 'components', children: [{ id: 'button', label: 'Button.tsx' }, { id: 'card', label: 'Card.tsx' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

export default function TreeBasic() {
  const [selected, setSelected] = useState('button');
  return (
    <div style={{ width: 280 }}>
      <TreeView aria-label="Files" data={TREE} selectedId={selected} onSelect={n => setSelected(n.id)} defaultExpandedIds={['src', 'components']} />
    </div>
  );
}
