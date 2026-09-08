import React, { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronUp, ChevronDown, X } from 'lucide-react';


/* --- SWITCH --- */
export interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  description?: string;
  className?: string;
  name?: string;
  id?: string;
  value?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      size = 'md',
      description,
      className = '',
      name,
      id,
      value,
      required,
      onBlur,
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        className={`field-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          name={name}
          id={id}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          onBlur={onBlur}
          onChange={e => onChange(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none', margin: 0 }}
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          className={`field-switch ${size === 'sm' ? 'field-switch-sm' : ''} ${checked ? 'checked' : ''}`}
          onClick={() => !disabled && onChange(!checked)}
        >
          <span className="field-switch-thumb" />
        </button>
        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
            {label && <span className="field-label" style={{ cursor: 'pointer', margin: 0 }}>{label}</span>}
            {description && <span className="field-helper-text">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

/* --- CHECKBOX --- */
export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
  name?: string;
  id?: string;
  value?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      indeterminate = false,
      className = '',
      name,
      id,
      value,
      required,
      onBlur,
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          userSelect: 'none',
          position: 'relative',
        }}
        className={className}
      >
        <input
          ref={ref}
          type="checkbox"
          name={name}
          id={id}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          onBlur={onBlur}
          onChange={e => onChange(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none', margin: 0 }}
        />
        <span
          className={`field-checkbox ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
          aria-hidden="true"
        >
          {checked && !indeterminate && <Check size={13} strokeWidth={2.75} style={{ display: 'block', flexShrink: 0 }} />}
          {indeterminate && (
            <span
              style={{
                width: '8px',
                height: '2px',
                backgroundColor: 'var(--field-text-inverse, #fff)',
                borderRadius: '1px',
                display: 'block',
              }}
            />
          )}
        </span>
        {label && <span className="field-text field-text-sm">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* --- RADIO GROUP --- */
export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  label?: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (val: T) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
}

export function RadioGroup<T extends string = string>(props: Readonly<RadioGroupProps<T>>) {
  const {
    label,
    options,
    value,
    onChange,
    disabled = false,
    className = '',
    name,
    required,
  } = props;
  return (
    <div className={`field-form-item ${className}`} role="radiogroup" aria-label={label}>
      {label && <span className="field-label">{label}</span>}
      <div className="field-radio-group">
        {options.map(opt => {
          const isSelected = opt.value === value;
          const isDisabled = disabled || opt.disabled;
          return (
            <label
              key={opt.value}
              className={`field-radio-item ${isDisabled ? 'disabled' : ''}`}
              style={{ position: 'relative' }}
            >
              {name && (
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  required={required}
                  onChange={() => onChange(opt.value)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none', margin: 0 }}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && onChange(opt.value)}
                className={`field-radio-button ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}`}
              >
                {isSelected && <span className="field-radio-dot" />}
              </button>
              <div className="field-radio-content">
                <span className="field-radio-label">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="field-radio-desc">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* --- SLIDER & LEVEL ZONES --- */
export interface SliderZone {
  from?: number;
  to: number;
  color?: 'success' | 'warning' | 'danger' | 'accent' | (string & {});
  label?: string;
}

export interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  zones?: SliderZone[];
  showMarks?: boolean;
  glow?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  required?: boolean;
}

const resolveColor = (c?: string): string => {
  if (!c) return 'var(--field-accent-primary)';
  switch (c) {
    case 'success': return 'var(--field-status-success-base, #10B981)';
    case 'warning': return 'var(--field-status-warning-base, #F59E0B)';
    case 'danger': return 'var(--field-status-danger-base, #EF4444)';
    case 'accent': return 'var(--field-accent-primary)';
    default: return c;
  }
};

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  zones,
  showMarks = false,
  glow = false,
  disabled = false,
  showValue = true,
  valueSuffix = '',
  className = '',
  style,
  name,
  id,
  required,
}) => {
  const rangeSpan = Math.max(1, max - min);
  const clampedValue = Math.min(max, Math.max(min, value));
  const valuePercent = ((clampedValue - min) / rangeSpan) * 100;

  // Resolve zones with explicit start and end boundaries
  const resolvedZones = React.useMemo(() => {
    if (!zones || zones.length === 0) return null;
    let currentFrom = min;
    return zones.map((z) => {
      const from = z.from ?? currentFrom;
      const to = Math.min(max, z.to);
      currentFrom = to;
      return {
        from,
        to,
        color: resolveColor(z.color),
        label: z.label,
      };
    });
  }, [zones, min, max]);

  // Find active zone for current slider value
  const activeZone = React.useMemo(() => {
    if (!resolvedZones) return null;
    return (
      resolvedZones.find((z) => clampedValue >= z.from && clampedValue <= z.to) ||
      resolvedZones.at(-1)
    );
  }, [resolvedZones, clampedValue]);

  const activeColor = activeZone ? activeZone.color : 'var(--field-accent-primary)';

  return (
    <div
      className={`field-slider-container ${disabled ? 'disabled' : ''} ${className}`}
      style={style}
    >
      {(label || showValue) && (
        <div className="field-slider-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {label && <span className="field-label" style={{ margin: 0 }}>{label}</span>}
            {activeZone?.label && (
              <span
                className="field-slider-zone-badge"
                style={{
                  color: activeColor,
                  backgroundColor: `color-mix(in srgb, ${activeColor} 14%, transparent)`,
                  borderColor: `color-mix(in srgb, ${activeColor} 30%, transparent)`,
                }}
              >
                {activeZone.label}
              </span>
            )}
          </div>
          {showValue && (
            <span
              className="field-slider-value"
              style={{
                color: activeZone ? activeColor : 'var(--field-text-primary)',
              }}
            >
              {clampedValue}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div className="field-slider-track-wrapper">
        {/* Background track (shows colored zone levels if defined) */}
        <div className="field-slider-track-bg">
          {resolvedZones ? (
            resolvedZones.map((zone) => {
              const left = ((zone.from - min) / rangeSpan) * 100;
              const width = ((zone.to - zone.from) / rangeSpan) * 100;
              return (
                <div
                  key={`zone-${zone.from}-${zone.to}`}
                  className="field-slider-zone-segment"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: `color-mix(in srgb, ${zone.color} 22%, var(--field-surface-active))`,
                  }}
                  title={zone.label ? `${zone.label}: ${zone.from} - ${zone.to}` : undefined}
                />
              );
            })
          ) : (
            <div className="field-slider-default-track" />
          )}
        </div>

        {/* Dynamic filled track */}
        <div
          className="field-slider-track-fill"
          style={{
            width: `${valuePercent}%`,
            backgroundColor: activeColor,
            boxShadow: glow ? `0 0 8px color-mix(in srgb, ${activeColor} 50%, transparent)` : 'none',
          }}
        />

        {/* Threshold boundary divider lines layer (sits above track fill so reached lines remain visible) */}
        {resolvedZones && resolvedZones.length > 1 && (
          <div className="field-slider-threshold-lines">
            {resolvedZones.slice(0, -1).map((zone) => {
              const linePercent = ((zone.to - min) / rangeSpan) * 100;
              const isReached = clampedValue >= zone.to;
              return (
                <div
                  key={`line-${zone.to}`}
                  className={`field-slider-threshold-line ${isReached ? 'reached' : 'unreached'}`}
                  style={{
                    left: `${linePercent}%`,
                    backgroundColor: isReached
                      ? 'var(--field-surface-base, #0D1117)'
                      : `color-mix(in srgb, ${zone.color} 75%, transparent)`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Native range input layered on top for full accessibility */}
        <input
          type="range"
          name={name}
          id={id}
          required={required}
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="field-slider-input"
          style={{
            '--thumb-color': activeColor,
            '--thumb-glow': glow ? `0 0 10px ${activeColor}` : 'none',
          } as React.CSSProperties}
          aria-label={label || 'Slider control'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
        />
      </div>

      {/* Marks / Level labels beneath track */}
      {showMarks && resolvedZones && (
        <div className="field-slider-marks">
          {resolvedZones.map((zone) => {
            const markPercent = ((zone.to - min) / rangeSpan) * 100;
            return (
              <span
                key={`mark-${zone.to}`}
                className="field-slider-mark"
                style={{ left: `${markPercent}%` }}
              >
                {zone.to}{valueSuffix}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* --- NUMBER INPUT / STEPPER --- */
export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  label,
  helperText,
  error,
  disabled = false,
  className = '',
  name,
  id,
  required,
  onBlur,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentVal = isControlled ? controlledValue : internalValue;

  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  const updateValue = (next: number) => {
    const clamped = clamp(next);
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const handleStepUp = () => {
    if (!disabled) updateValue(currentVal + step);
  };

  const handleStepDown = () => {
    if (!disabled) updateValue(currentVal - step);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStepUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStepDown();
    }
  };

  return (
    <div className={`field-form-item ${className}`}>
      {label && <label htmlFor={id} className="field-label">{label}</label>}
      <div className={`field-number-input-wrapper ${error ? 'error' : ''}`}>
        <input
          type="number"
          name={name}
          id={id}
          required={required}
          onBlur={onBlur}
          className="field-number-input"
          value={Number.isNaN(currentVal) ? '' : currentVal}
          min={min !== -Infinity ? min : undefined}
          max={max !== Infinity ? max : undefined}
          step={step}
          disabled={disabled}
          onChange={e => {
            const parsed = Number.parseFloat(e.target.value);
            updateValue(Number.isNaN(parsed) ? 0 : parsed);
          }}
          onKeyDown={handleKeyDown}
        />
        {unit && <span className="field-number-input-unit">{unit}</span>}
        <div className="field-number-input-stepper">
          <button
            type="button"
            className="field-number-stepper-btn"
            disabled={disabled || currentVal >= max}
            onClick={handleStepUp}
            aria-label="Increase value"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            className="field-number-stepper-btn"
            disabled={disabled || currentVal <= min}
            onClick={handleStepDown}
            aria-label="Decrease value"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
      {error && <span className="field-error-text">{error}</span>}
      {!error && helperText && <span className="field-helper-text">{helperText}</span>}
    </div>
  );
};

/* --- COMBOBOX / MULTI-SELECT --- */
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (val: string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select options...',
  label,
  helperText,
  error,
  disabled = false,
  className = '',
  name,
  id,
  required,
}) => {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled ? controlledValue : internalValue;

  const updateValues = (next: string[]) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleToggleOption = (val: string) => {
    if (currentValues.includes(val)) {
      updateValues(currentValues.filter(v => v !== val));
    } else {
      updateValues([...currentValues, val]);
    }
    inputRef.current?.focus();
  };

  const handleRemoveChip = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateValues(currentValues.filter(v => v !== val));
  };

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const generatedId = useId();
  const comboboxId = id || generatedId;
  const listboxId = `${comboboxId}-listbox`;

  return (
    <div ref={containerRef} className={`field-form-item ${className}`}>
      {name && currentValues.map(val => (
        <input key={val} type="hidden" name={name} value={val} />
      ))}
      {label && <label htmlFor={id} className="field-label">{label}</label>}
      <div
        className={`field-combobox-container ${error ? 'error' : ''}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        onKeyDown={e => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {currentValues.map(val => {
          const opt = options.find(o => o.value === val);
          return (
            <span key={val} className="field-tag-chip">
              <span>{opt ? opt.label : val}</span>
              {!disabled && (
                <button
                  type="button"
                  className="field-tag-chip-remove"
                  onClick={e => handleRemoveChip(val, e)}
                  aria-label={`Remove ${opt ? opt.label : val}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          );
        })}
        <input
          id={id}
          ref={inputRef}
          type="text"
          className="field-combobox-input"
          value={search}
          disabled={disabled}
          placeholder={currentValues.length === 0 ? placeholder : ''}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div style={{ position: 'relative' }}>
          <ul id={listboxId} className="field-select-dropdown" role="listbox">
            {filteredOptions.length === 0 ? (
              <li style={{ padding: '8px 12px', fontSize: '0.8125rem', color: 'var(--field-text-tertiary)' }}>
                No options found
              </li>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = currentValues.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    role="option"
                    tabIndex={opt.disabled ? -1 : 0}
                    aria-selected={isSelected}
                    className={`field-select-option ${isSelected ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}`}
                    onClick={() => !opt.disabled && handleToggleOption(opt.value)}
                    onKeyDown={e => {
                      if (!opt.disabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleToggleOption(opt.value);
                      }
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} color="var(--field-accent-primary)" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <span className="field-error-text">{error}</span>}
      {!error && helperText && <span className="field-helper-text">{helperText}</span>}
    </div>
  );
};

