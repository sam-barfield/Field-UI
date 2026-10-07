'use client';

import React, { useState, useRef, useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useAnchoredPosition, useControllableState, useDismissableLayer } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { FieldLabel, FieldMessage, getFieldDescriptionId } from './Input.js';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  /** Secondary line shown under the label in the dropdown. */
  description?: string;
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  label?: React.ReactNode;
  options: SelectOption<T>[];
  /** Controlled value. */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue?: T;
  /** Called with the selected option's value. */
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  /** Renders a hidden input so the value is submitted with native forms. */
  name?: string;
  id?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  /** Accessible name when no visible `label` is rendered. */
  'aria-label'?: string;
  /** Element to render the dropdown into. Defaults to `document.body`. */
  container?: HTMLElement | null;
}

function SelectInner<T extends string = string>(
  {
    label,
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    placeholder = 'Select an option...',
    disabled = false,
    helperText,
    error,
    className = '',
    name,
    id: customId,
    required,
    onBlur,
    'aria-label': ariaLabel,
    container,
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeValue, setActiveValue] = useControllableState<T | undefined>({
    value: controlledValue,
    defaultValue,
    onChange: onChange as ((v: T | undefined) => void) | undefined,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({ query: '', timeout: 0 as ReturnType<typeof setTimeout> | 0 });
  const generatedId = useId();
  const id = customId || generatedId;
  const listboxId = `${id}-listbox`;
  const portalProps = usePortalThemeProps('field-select-dropdown');
  const { style: floatingStyle } = useAnchoredPosition(triggerRef, listRef, isOpen, { matchWidth: true, offset: 4 });

  const selectedIndex = options.findIndex(opt => opt.value === activeValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = (focusTrigger = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (focusTrigger) triggerRef.current?.focus();
  };

  useDismissableLayer(isOpen, { refs: [triggerRef, listRef], onDismiss: () => close(false) });

  // Keep the active option scrolled into view
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  const findEnabled = (start: number, step: 1 | -1) => {
    for (let i = start; i >= 0 && i < options.length; i += step) {
      if (!options[i].disabled) return i;
    }
    return -1;
  };

  const open = (index?: number) => {
    if (disabled) return;
    setIsOpen(true);
    setActiveIndex(index ?? (selectedIndex >= 0 ? selectedIndex : findEnabled(0, 1)));
  };

  const handleSelect = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    setActiveValue(opt.value);
    close();
  };

  const handleTypeahead = (key: string) => {
    const state = typeaheadRef.current;
    if (state.timeout) clearTimeout(state.timeout);
    state.query += key.toLowerCase();
    state.timeout = setTimeout(() => {
      state.query = '';
    }, 500);
    const start = isOpen ? activeIndex + 1 : selectedIndex + 1;
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    const match = ordered.find(opt => !opt.disabled && opt.label.toLowerCase().startsWith(state.query));
    if (!match) return;
    const idx = options.indexOf(match);
    if (isOpen) setActiveIndex(idx);
    else setActiveValue(match.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) open();
        else setActiveIndex(prev => {
          const next = findEnabled(prev + 1, 1);
          return next === -1 ? prev : next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) open();
        else setActiveIndex(prev => {
          const next = findEnabled(prev - 1, -1);
          return next === -1 ? prev : next;
        });
        break;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(findEnabled(0, 1));
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(findEnabled(options.length - 1, -1));
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) handleSelect(activeIndex);
        else if (!isOpen) open();
        break;
      case 'Tab':
        if (isOpen) close(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) handleTypeahead(e.key);
    }
  };

  const describedBy = getFieldDescriptionId(id, error, helperText);
  const portalTarget = getPortalTarget(container);

  return (
    <div className={mergeClassNames('field-form-item', 'field-select', className)}>
      <input
        ref={ref}
        type="hidden"
        name={name}
        id={`${id}-input`}
        value={activeValue ?? ''}
        required={required}
      />
      {label && (
        <FieldLabel id={`${id}-label`} htmlFor={id} required={required}>
          {label}
        </FieldLabel>
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        aria-labelledby={label ? `${id}-label ${id}` : undefined}
        aria-label={!label ? ariaLabel : undefined}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={mergeClassNames('field-select-trigger', error && 'error', isOpen && 'open')}
      >
        <span className={mergeClassNames('field-select-value', !selectedOption && 'placeholder')}>
          {selectedOption?.icon && <span className="field-select-option-icon">{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="field-select-chevron" aria-hidden="true" />
      </button>

      {isOpen &&
        portalTarget &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-label={!label ? ariaLabel : undefined}
            {...portalProps}
            style={{ ...portalProps.style, ...floatingStyle }}
          >
            {options.length === 0 && <li className="field-select-empty">No options</li>}
            {options.map((opt, idx) => {
              const isSelected = opt.value === activeValue;
              return (
                <li
                  key={opt.value}
                  id={`${id}-option-${idx}`}
                  data-index={idx}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  className={mergeClassNames(
                    'field-select-option',
                    isSelected && 'selected',
                    idx === activeIndex && 'active',
                    opt.disabled && 'disabled'
                  )}
                  onMouseDown={e => e.preventDefault()}
                  onMouseMove={() => !opt.disabled && activeIndex !== idx && setActiveIndex(idx)}
                  onClick={() => handleSelect(idx)}
                >
                  {opt.icon && <span className="field-select-option-icon">{opt.icon}</span>}
                  <span className="field-select-option-text">
                    <span>{opt.label}</span>
                    {opt.description && <span className="field-select-option-desc">{opt.description}</span>}
                  </span>
                  {isSelected && <Check size={14} className="field-select-check" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>,
          portalTarget
        )}
      <FieldMessage id={id} error={error} helperText={helperText} />
    </div>
  );
}

/**
 * A styled, accessible single-select dropdown (WAI-ARIA select-only combobox).
 * Supports arrow keys, Home/End, type-ahead and native form submission via `name`.
 *
 * @example
 * <Select label="Region" value={region} onChange={setRegion}
 *   options={[{ value: 'us-east-1', label: 'US East (N. Virginia)' }]} />
 */
export const Select = React.forwardRef(SelectInner) as <T extends string = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement;
