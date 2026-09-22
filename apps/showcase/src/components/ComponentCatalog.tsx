import React, { useState, useEffect } from 'react';
import { ComponentSidebar } from './catalog/ComponentSidebar';
import { ComponentDocView } from './catalog/ComponentDocView';
import { componentRegistry } from './catalog/catalogRegistry';
import { Button, Drawer } from '@sam.barfield/field-react';
import { Menu, Layers } from 'lucide-react';

interface ComponentCatalogProps {
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (vp: 'desktop' | 'tablet' | 'mobile') => void;
}

export const ComponentCatalog: React.FC<ComponentCatalogProps> = ({
  viewport = 'desktop',
  onViewportChange,
}) => {
  const [selectedId, setSelectedId] = useState<string>('alert');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  // Check window screen width for native mobile display
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 860);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Find active component document, fallback to first if not found
  const activeDoc =
    componentRegistry.find((c) => c.id === selectedId) || componentRegistry[0];

  // Scroll to top when switching components
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedId]);

  const handleSelectComponent = (id: string) => {
    setSelectedId(id);
    setMobileDrawerOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobileScreen ? 'column' : 'row',
        minHeight: 'calc(100vh - 100px)',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Native Mobile Screen Header Bar: Quick Component Selector */}
      {isMobileScreen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginBottom: '16px',
            backgroundColor: 'var(--field-surface-raised)',
            border: '1px solid var(--field-border-default)',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} style={{ color: 'var(--field-accent-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{activeDoc.name}</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setMobileDrawerOpen(true)}
            leftIcon={<Menu size={14} />}
          >
            Components
          </Button>

          <Drawer
            isOpen={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            title="Component Catalog"
          >
            <div style={{ padding: '8px 0' }}>
              <ComponentSidebar
                components={componentRegistry}
                selectedId={activeDoc.id}
                onSelect={handleSelectComponent}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </Drawer>
        </div>
      )}

      {/* Desktop Persistent Left Component List Sidebar */}
      {!isMobileScreen && (
        <ComponentSidebar
          components={componentRegistry}
          selectedId={activeDoc.id}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Main Component Documentation Page */}
      <ComponentDocView
        key={activeDoc.id}
        doc={activeDoc}
        allComponents={componentRegistry}
        onSelectComponent={setSelectedId}
        viewport={viewport}
        onViewportChange={onViewportChange}
      />
    </div>
  );
};
