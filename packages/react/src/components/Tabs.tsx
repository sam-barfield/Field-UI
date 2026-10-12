'use client';

import React, { createContext, useContext, useId, useRef } from 'react';
import { getInteractiveElementProps, mergeClassNames, renderPolymorphic, resolveTag } from '../utils/polymorphic.js';
import { handleListKeyNavigation, useControllableState } from '../utils/hooks.js';
import { useLinkComponent } from '../theme/ThemeProvider.js';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Small count or status shown after the label. */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Render the tab as a link (for route-based tabs). */
  href?: string;
  /** Render `label` (a link element) as the tab itself, merging tab props onto it. */
  asChild?: boolean;
  as?: React.ElementType;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  /** Controlled active tab id. */
  activeId?: T;
  /** Initial tab when uncontrolled. Defaults to the first tab. */
  defaultActiveId?: T;
  onChange?: (id: T) => void;
  /** Accessible name for the tab list. */
  'aria-label'?: string;
  className?: string;
  /** Tab panels. Use `<TabPanel id="...">` so ARIA attributes are wired up. */
  children?: React.ReactNode;
}

interface TabsContextValue {
  baseId: string;
  activeId?: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Horizontal tabs. Arrow keys move between tabs, Home/End jump to the ends.
 * Render content with `<TabPanel id>` children, or read `activeId` yourself.
 *
 * @example
 * <Tabs items={[{ id: 'overview', label: 'Overview' }, { id: 'logs', label: 'Logs' }]}>
 *   <TabPanel id="overview">…</TabPanel>
 *   <TabPanel id="logs">…</TabPanel>
 * </Tabs>
 */
export function Tabs<T extends string = string>({
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  onChange,
  'aria-label': ariaLabel,
  className = '',
  children,
}: TabsProps<T>): React.ReactElement {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const linkComponent = useLinkComponent();
  const [activeId, setActiveId] = useControllableState<T | undefined>({
    value: controlledActiveId,
    defaultValue: defaultActiveId ?? items.find(item => !item.disabled)?.id,
    onChange: onChange as ((id: T | undefined) => void) | undefined,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const handled = handleListKeyNavigation(e, listRef.current, '[role="tab"]', 'horizontal');
    if (!handled) return;
    const focusedId = (document.activeElement as HTMLElement | null)?.dataset.tabId;
    const focusedItem = items.find(item => item.id === focusedId);
    // Automatic activation for button tabs; link tabs only move focus.
    if (focusedItem && !focusedItem.href && !focusedItem.asChild && !focusedItem.as) setActiveId(focusedItem.id);
  };

  return (
    <TabsContext.Provider value={{ baseId, activeId: activeId as string | undefined }}>
      <div className={mergeClassNames('field-tabs', className)}>
        <div className="field-tabs-container">
          <div
            ref={listRef}
            className="field-tabs-list"
            role="tablist"
            aria-label={ariaLabel}
            onKeyDown={handleKeyDown}
          >
            {items.map(item => {
              const isActive = item.id === activeId;
              const sharedProps = {
                role: 'tab',
                id: `${baseId}-tab-${item.id}`,
                'aria-selected': isActive,
                'aria-controls': `${baseId}-panel-${item.id}`,
                'data-tab-id': item.id,
                tabIndex: isActive ? 0 : -1,
                onClick: () => !item.disabled && setActiveId(item.id),
                className: mergeClassNames('field-tab-trigger', isActive && 'active'),
              };

              if (item.asChild && React.isValidElement(item.label)) {
                return (
                  <React.Fragment key={item.id}>
                    {renderPolymorphic('button', {
                      asChild: true,
                      ...sharedProps,
                      'aria-disabled': item.disabled || undefined,
                      children: item.label,
                    })}
                  </React.Fragment>
                );
              }

              const tag: React.ElementType = resolveTag(linkComponent, item.as, item.href, item.href ? 'a' : 'button');
              return (
                <React.Fragment key={item.id}>
                  {renderPolymorphic(tag, {
                    ...sharedProps,
                    ...getInteractiveElementProps(tag, { href: item.href, disabled: item.disabled }),
                    children: (
                      <>
                        {item.icon && <span className="field-tab-icon" aria-hidden="true">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.badge !== undefined && <span className="field-tab-badge">{item.badge}</span>}
                      </>
                    ),
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.displayName = 'Tabs';

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must match the `id` of a tab item. */
  id: string;
  /** Keep the panel mounted (hidden) when inactive, preserving its state. Default `false`. */
  keepMounted?: boolean;
}

/**
 * Content for one tab. Only renders while its tab is active (unless
 * `keepMounted`), and is labelled by its tab for screen readers.
 */
export const TabPanel: React.FC<TabPanelProps> = ({ id, keepMounted = false, className, children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('<TabPanel> must be rendered inside <Tabs>');
  }
  const isActive = ctx.activeId === id;
  if (!isActive && !keepMounted) return null;

  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${id}`}
      aria-labelledby={`${ctx.baseId}-tab-${id}`}
      hidden={!isActive}
      tabIndex={0}
      className={mergeClassNames('field-tab-panel', className)}
      {...props}
    >
      {children}
    </div>
  );
};
