import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Command } from 'lucide-react';
import { Kbd } from './Typography';
import { useThemeSafe } from '../theme';

export interface CommandItemData {
  id: string;
  title: string;
  category?: string;
  description?: string;
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
  enableGlobalHotkey?: boolean;
  onOpen?: () => void;
  container?: HTMLElement | null;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search resources...',
  enableGlobalHotkey = true,
  onOpen,
  container,
  className = '',
}) => {
  const { theme } = useThemeSafe();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    if (!enableGlobalHotkey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableGlobalHotkey, isOpen, onClose, onOpen]);

  // Reset search and selected index when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items based on query
  const filteredItems = items.filter(item => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  // Keep selected index in range
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  // Keyboard navigation within the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current && !current.disabled) {
        current.onSelect();
        onClose();
      }
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  // Group filtered items by category
  const groups: Record<string, CommandItemData[]> = {};
  filteredItems.forEach(item => {
    const cat = item.category || 'General';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });

  let globalIndexCounter = 0;

  const content = (
    <div
      className={`field-command-wrapper field-scope ${className}`.trim()}
      data-field-theme={theme.id}
      data-theme={theme.mode}
    >
      <button
        type="button"
        aria-label="Close command palette"
        className="field-command-backdrop"
        onClick={onClose}
      />
      <dialog className="field-command-dialog" open aria-label="Command palette">
        <div className="field-command-search-bar">
          <Search size={18} color="var(--field-text-tertiary)" />
          <input
            ref={inputRef}
            type="text"
            className="field-command-search-input"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search commands"
          />
          <Kbd>ESC</Kbd>
        </div>

        <div className="field-command-list">
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--field-text-tertiary)', fontSize: '0.875rem' }}>
              No matching commands or resources found.
            </div>
          ) : (
            Object.entries(groups).map(([groupTitle, groupItems]) => (
              <div key={groupTitle} className="field-command-group">
                <div className="field-command-group-heading">{groupTitle}</div>
                {groupItems.map(item => {
                  const itemIndex = globalIndexCounter++;
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.disabled}
                      className={`field-command-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (!item.disabled) {
                          item.onSelect();
                          onClose();
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <div className="field-command-item-left">
                        {item.icon && (
                          <span style={{ color: isSelected ? 'var(--field-accent-primary)' : 'var(--field-text-secondary)', display: 'inline-flex' }}>
                            {item.icon}
                          </span>
                        )}
                        <div>
                          <div>{item.title}</div>
                          {item.description && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--field-text-secondary)', marginTop: '2px' }}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.shortcut && (
                        <div className="field-command-shortcut">
                          <Kbd>{item.shortcut}</Kbd>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="field-command-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Navigate</span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Select</span>
            <Kbd>↵</Kbd>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Command size={12} />
            <span>Field Omnibar</span>
          </div>
        </div>
      </dialog>
    </div>
  );

  const portalTarget = container || (typeof document !== 'undefined' ? document.body : null);
  if (!portalTarget) return null;

  return createPortal(content, portalTarget);
};
