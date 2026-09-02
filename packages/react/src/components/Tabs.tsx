import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  onChange,
  className = '',
}) => {
  const [internalActive, setInternalActive] = useState(defaultActiveId || items[0]?.id);
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActive;

  const handleSelect = (id: string) => {
    if (controlledActiveId === undefined) setInternalActive(id);
    onChange?.(id);
  };

  return (
    <div className={`field-tabs-container ${className}`}>
      <div className="field-tabs-list" role="tablist">
        {items.map(item => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => handleSelect(item.id)}
              className={`field-tab-trigger ${isActive ? 'active' : ''}`}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
