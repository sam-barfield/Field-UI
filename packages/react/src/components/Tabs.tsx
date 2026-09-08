import React, { useState } from 'react';
import { renderPolymorphic } from '../utils/polymorphic';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  asChild?: boolean;
  as?: React.ElementType;
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
  children,
}) => {
  const [internalActive, setInternalActive] = useState(defaultActiveId || items[0]?.id);
  const activeId = controlledActiveId ?? internalActive;

  const handleSelect = (id: string) => {
    if (controlledActiveId === undefined) setInternalActive(id);
    onChange?.(id);
  };

  return (
    <div className={`field-tabs-container ${className}`}>
      <div className="field-tabs-list" role="tablist">
        {items.map(item => {
          const isActive = item.id === activeId;
          const itemClass = `field-tab-trigger ${isActive ? 'active' : ''}`;
          const itemContent = (
            <>
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          if (item.asChild && React.isValidElement(item.label)) {
            return (
              <React.Fragment key={item.id}>
                {renderPolymorphic('button', {
                  asChild: true,
                  role: 'tab',
                  'aria-selected': isActive,
                  disabled: item.disabled,
                  onClick: () => handleSelect(item.id),
                  className: itemClass,
                  children: item.label,
                })}
              </React.Fragment>
            );
          }

          const defaultTag = item.href ? 'a' : 'button';
          return (
            <React.Fragment key={item.id}>
              {renderPolymorphic(defaultTag, {
                as: item.as,
                role: 'tab',
                'aria-selected': isActive,
                href: item.disabled ? undefined : item.href,
                type: !item.href && (!item.as || item.as === 'button') ? 'button' : undefined,
                disabled: item.disabled,
                onClick: () => handleSelect(item.id),
                className: itemClass,
                children: itemContent,
              })}
            </React.Fragment>
          );
        })}
      </div>
      {children}
    </div>
  );
};
