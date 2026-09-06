import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  TextInput,
  Badge,
} from '@sam.barfield/field-react';
import { Search, Layers, ChevronRight } from 'lucide-react';
import { ComponentDoc } from './types';

interface ComponentSidebarProps {
  components: ComponentDoc[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  components,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  // Filter components by search
  const filtered = components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categories list
  const categories: Array<ComponentDoc['category']> = [
    'Actions',
    'Forms',
    'Navigation',
    'Layout',
    'Data Display',
    'Feedback',
    'Typography',
  ];

  return (
    <Sidebar
      width={260}
      density="compact"
      style={{
        height: 'calc(100vh - 110px)',
        position: 'sticky',
        top: '80px',
        flexShrink: 0,
        backgroundColor: 'transparent',
        borderRight: '1px solid var(--field-border-subtle)',
      }}
    >
      {/* Search Bar in SidebarHeader */}
      <SidebarHeader
        showToggle={false}
        style={{
          borderBottom: 'none',
          padding: '8px 10px 14px',
          minHeight: 'auto',
        }}
      >
        <TextInput
          placeholder="Search components..."
          leftAdornment={<Search size={14} />}
          rightAdornment={
            searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--field-text-tertiary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '0 2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : undefined
          }
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          isFullWidth
        />
      </SidebarHeader>

      {/* Scrollable Navigation List */}
      <SidebarContent style={{ paddingRight: '10px' }}>
        {searchQuery ? (
          /* Search Results */
          <SidebarGroup label={`Results (${filtered.length})`}>
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: '16px 8px',
                  fontSize: '0.8125rem',
                  color: 'var(--field-text-tertiary)',
                }}
              >
                No components found matching "{searchQuery}"
              </div>
            ) : (
              filtered.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <SidebarItem
                    key={item.id}
                    label={item.name}
                    badge={
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--field-text-tertiary)',
                        }}
                      >
                        {item.category}
                      </span>
                    }
                    isActive={isActive}
                    onClick={() => onSelect(item.id)}
                  />
                );
              })
            )}
          </SidebarGroup>
        ) : (
          /* Structured Category List */
          <>
            <SidebarGroup label="SECTIONS">
              <SidebarItem
                icon={<Layers size={15} />}
                label="Components"
                badge={<Badge size="sm" variant="default">{components.length}</Badge>}
                isActive
              />
            </SidebarGroup>

            <SidebarGroup label="COMPONENTS">
              {categories.map((cat) => {
                const catItems = components.filter((c) => c.category === cat);
                if (catItems.length === 0) return null;

                return (
                  <SidebarGroup key={cat} label={cat}>
                    {catItems.map((item) => {
                      const isActive = item.id === selectedId;
                      return (
                        <SidebarItem
                          key={item.id}
                          label={item.name}
                          badge={
                            isActive ? (
                              <ChevronRight
                                size={13}
                                style={{ color: 'var(--field-accent-primary)' }}
                              />
                            ) : undefined
                          }
                          isActive={isActive}
                          onClick={() => onSelect(item.id)}
                        />
                      );
                    })}
                  </SidebarGroup>
                );
              })}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
