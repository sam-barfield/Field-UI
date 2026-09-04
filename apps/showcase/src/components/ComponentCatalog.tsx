import React, { useState, useEffect } from 'react';
import { ComponentSidebar } from './catalog/ComponentSidebar';
import { ComponentDocView } from './catalog/ComponentDocView';
import { componentRegistry } from './catalog/catalogRegistry';

export const ComponentCatalog: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('alert');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find active component document, fallback to first if not found
  const activeDoc =
    componentRegistry.find((c) => c.id === selectedId) || componentRegistry[0];

  // Scroll to top when switching components
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedId]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 100px)',
        width: '100%',
      }}
    >
      {/* Shadcn-Style Left Component List Sidebar */}
      <ComponentSidebar
        components={componentRegistry}
        selectedId={activeDoc.id}
        onSelect={setSelectedId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Component Documentation Page */}
      <ComponentDocView
        key={activeDoc.id}
        doc={activeDoc}
        allComponents={componentRegistry}
        onSelectComponent={setSelectedId}
      />
    </div>
  );
};
