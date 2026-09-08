import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  label?: string;
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
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
    error,
    className = '',
    name,
    id: customId,
    required,
    onBlur,
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const id = customId || generatedId;

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find(opt => opt.value === activeValue);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: T) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`field-form-item ${className}`} ref={containerRef}>
      {name && (
        <input
          ref={ref}
          type="hidden"
          name={name}
          id={`${id}-input`}
          value={activeValue ?? ''}
          required={required}
          onBlur={onBlur}
        />
      )}
      {label && (
        <label id={`${id}-label`} htmlFor={`${id}-trigger`} className="field-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <button
          id={`${id}-trigger`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          onKeyDown={handleKeyDown}
          className={`field-select-trigger ${error ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        >
          <span style={{ color: selectedOption ? 'var(--field-text-primary)' : 'var(--field-text-disabled)' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--field-text-secondary)',
              transition: 'transform 0.15s ease',
              transform: isOpen ? 'rotate(180deg)' : 'none',
            }}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="field-select-dropdown"
          >
            {options.map(opt => {
              const isSelected = opt.value === activeValue;
              return (
                <li
                  key={opt.value}
                  role="option"
                  tabIndex={opt.disabled ? -1 : 0}
                  aria-selected={isSelected}
                  className={`field-select-option ${isSelected ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}`}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  onKeyDown={(e) => {
                    if (!opt.disabled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSelect(opt.value);
                    }
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} color="var(--field-accent-primary)" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && (
        <span className="field-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export const Select = React.forwardRef(SelectInner) as <T extends string = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement;
