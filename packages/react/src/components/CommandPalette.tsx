'use client';

import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { Kbd } from './Typography.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { useFocusTrap, useScrollLock } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';

export interface CommandItemData {
  id: string;
  title: string;
  /** Items are grouped under their category heading. Default "General". */
  category?: string;
  description?: string;
  /** Extra search terms that aren't displayed. */
  keywords?: string[];
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItemData[];
  placeholder?: string;
  /** Toggle with ⌘K / Ctrl+K. Requires `onOpen`. Default `true`. */
  enableGlobalHotkey?: boolean;
  /** Called when the global ⌘K / Ctrl+K hotkey asks to open the palette. */
  onOpen?: () => void;
  /** Shown when nothing matches the query. */
  emptyMessage?: React.ReactNode;
  /** Content for the right side of the footer. */
  footer?: React.ReactNode;
  container?: HTMLElement | null;
  className?: string;
}

const isMacPlatform = () =>
  typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

/**
 * A ⌘K search-and-run dialog. Filters items by title, category, description
 * and keywords; arrow keys move, Enter runs, Escape closes.
 *
 * @example
 * <CommandPalette isOpen={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} items={commands} />
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  enableGlobalHotkey = true,
  onOpen,
  emptyMessage = 'No matching results.',
  footer,
  container,
  className = '',
}) => {
  const baseId = useId();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const portalProps = usePortalThemeProps(mergeClassNames('field-command-wrapper', className));

  useScrollLock(isOpen);
  useFocusTrap(dialogRef, isOpen, { initialFocusRef: inputRef });

  // Global hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    if (!enableGlobalHotkey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = isMacPlatform() ? e.metaKey : e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableGlobalHotkey, isOpen, onClose, onOpen]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(item =>
      [item.title, item.category, item.description, ...(item.keywords ?? [])].some(field =>
        field?.toLowerCase().includes(query)
      )
    );
  }, [items, search]);

  // Group while preserving a flat index for keyboard navigation
  const groups = useMemo(() => {
    const map = new Map<string, Array<{ item: CommandItemData; index: number }>>();
    filteredItems.forEach(item => {
      const cat = item.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push({ item, index: -1 });
    });
    let i = 0;
    map.forEach(list => list.forEach(entry => (entry.index = i++)));
    return map;
  }, [filteredItems]);

  const orderedItems = useMemo(() => Array.from(groups.values()).flat().map(e => e.item), [groups]);

  useEffect(() => {
    if (selectedIndex >= orderedItems.length) setSelectedIndex(Math.max(0, orderedItems.length - 1));
  }, [orderedItems.length, selectedIndex]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const runItem = (item?: CommandItemData) => {
    if (!item || item.disabled) return;
    onClose();
    item.onSelect();
  };

  const moveSelection = (direction: 1 | -1) => {
    if (orderedItems.length === 0) return;
    setSelectedIndex(prev => (prev + direction + orderedItems.length) % orderedItems.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveSelection(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveSelection(-1);
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setSelectedIndex(0);
        }
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setSelectedIndex(orderedItems.length - 1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        runItem(orderedItems[selectedIndex]);
        break;
    }
  };

  const portalTarget = getPortalTarget(container);
  if (!isOpen || !portalTarget) return null;

  const listboxId = `${baseId}-listbox`;
  const activeId = orderedItems[selectedIndex] ? `${baseId}-item-${selectedIndex}` : undefined;

  return createPortal(
    <div {...portalProps}>
      <div className="field-command-backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        className="field-command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        <div className="field-command-search-bar">
          <Search size={18} className="field-command-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            className="field-command-search-input"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <Kbd>Esc</Kbd>
        </div>

        <div ref={listRef} id={listboxId} role="listbox" aria-label="Results" className="field-command-list">
          {orderedItems.length === 0 ? (
            <div className="field-command-empty">{emptyMessage}</div>
          ) : (
            Array.from(groups.entries()).map(([groupTitle, entries]) => (
              <div key={groupTitle} role="group" aria-labelledby={`${baseId}-group-${groupTitle}`} className="field-command-group">
                <div id={`${baseId}-group-${groupTitle}`} className="field-command-group-heading">
                  {groupTitle}
                </div>
                {entries.map(({ item, index }) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      id={`${baseId}-item-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={item.disabled || undefined}
                      className={mergeClassNames('field-command-item', isSelected && 'selected', item.disabled && 'disabled')}
                      onClick={() => runItem(item)}
                      onMouseMove={() => !isSelected && setSelectedIndex(index)}
                    >
                      <div className="field-command-item-left">
                        {item.icon && <span className="field-command-item-icon" aria-hidden="true">{item.icon}</span>}
                        <div className="field-command-item-text">
                          <div className="field-command-item-title">{item.title}</div>
                          {item.description && <div className="field-command-item-desc">{item.description}</div>}
                        </div>
                      </div>
                      {item.shortcut && (
                        <div className="field-command-shortcut">
                          <Kbd>{item.shortcut}</Kbd>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="field-command-footer" aria-hidden="true">
          <div className="field-command-footer-hints">
            <span className="field-command-hint">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> Navigate
            </span>
            <span className="field-command-hint">
              <Kbd>↵</Kbd> Select
            </span>
          </div>
          {footer ?? (
            <span className="field-command-hint">
              <Kbd>{isMacPlatform() ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd>K</Kbd> Toggle
            </span>
          )}
        </div>
      </div>
    </div>,
    portalTarget
  );
};
