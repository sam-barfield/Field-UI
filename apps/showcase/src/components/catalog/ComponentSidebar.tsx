import React from 'react';
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
  const filtered = components.filter(c =>
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
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        height: 'calc(100vh - 110px)',
        position: 'sticky',
        top: '80px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--field-border-subtle)',
        paddingRight: '16px',
      }}
    >
      {/* Search Bar */}
      <div style={{ paddingBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'var(--field-surface-sunken)',
            border: '1px solid var(--field-border-default)',
            borderRadius: '8px',
            fontSize: '0.8125rem',
          }}
        >
          <Search size={14} style={{ color: 'var(--field-text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--field-text-primary)',
              fontSize: '0.8125rem',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
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
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Scrollable List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '6px',
        }}
        className="field-sidebar-scrollbar"
      >
        {/* Sections Header */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--field-text-tertiary)',
              padding: '6px 8px',
            }}
          >
            Sections
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--field-text-primary)',
              fontSize: '0.875rem',
              fontWeight: 550,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={15} style={{ color: 'var(--field-accent-primary)' }} />
              <span>Components</span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--field-text-secondary)',
              }}
            >
              {components.length}
            </span>
          </div>
        </div>

        {/* If searching: flat results */}
        {searchQuery ? (
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--field-text-tertiary)',
                padding: '6px 8px',
              }}
            >
              Results ({filtered.length})
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: '16px 8px', fontSize: '0.8125rem', color: 'var(--field-text-tertiary)' }}>
                No components found matching "{searchQuery}"
              </div>
            ) : (
              filtered.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 12px',
                      margin: '2px 0',
                      borderRadius: '6px',
                      backgroundColor: isActive ? 'var(--field-surface-raised)' : 'transparent',
                      border: isActive ? '1px solid var(--field-border-default)' : '1px solid transparent',
                      color: isActive ? 'var(--field-text-primary)' : 'var(--field-text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--field-text-tertiary)' }}>
                      {item.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          /* Alphabetical list grouped or structured */
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--field-text-tertiary)',
                padding: '6px 8px',
              }}
            >
              Components
            </div>

            {categories.map((cat) => {
              const catItems = components.filter((c) => c.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'var(--field-text-tertiary)',
                      padding: '4px 8px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {cat}
                  </div>
                  {catItems.map((item) => {
                    const isActive = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(item.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          margin: '1px 0',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'var(--field-surface-raised)' : 'transparent',
                          border: isActive ? '1px solid var(--field-border-default)' : '1px solid transparent',
                          color: isActive ? 'var(--field-text-primary)' : 'var(--field-text-secondary)',
                          fontWeight: isActive ? 600 : 400,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <span>{item.name}</span>
                        {isActive && <ChevronRight size={13} style={{ color: 'var(--field-accent-primary)' }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
