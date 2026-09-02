import React from 'react';
import { Check } from 'lucide-react';

/* --- SWITCH --- */
export interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
  className = '',
}) => {
  return (
    <label
      className={`field-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '12px' }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`field-switch ${checked ? 'checked' : ''}`}
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
};

/* --- CHECKBOX --- */
export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
      className={className}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        className={`field-checkbox ${checked ? 'checked' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        {checked && <Check size={13} strokeWidth={2.75} style={{ display: 'block', flexShrink: 0 }} />}
      </button>
      {label && <span className="field-text field-text-sm">{label}</span>}
    </label>
  );
};

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
}

export function RadioGroup<T extends string = string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}: RadioGroupProps<T>) {
  return (
    <div className={`field-form-item ${className}`} role="radiogroup" aria-label={label}>
      {label && <span className="field-label">{label}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map(opt => {
          const isSelected = opt.value === value;
          const isDisabled = disabled || opt.disabled;
          return (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                userSelect: 'none',
              }}
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => !isDisabled && onChange(opt.value)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isSelected ? 'var(--field-accent-primary)' : 'var(--field-border-default)'}`,
                  background: 'var(--field-surface-sunken)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  padding: 0,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--field-accent-primary)',
                    }}
                  />
                )}
              </button>
              <div>
                <span className="field-text field-text-sm" style={{ fontWeight: isSelected ? 500 : 400 }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="field-helper-text" style={{ display: 'block' }}>
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

/* --- SLIDER --- */
export interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showValue = true,
  valueSuffix = '',
  className = '',
}) => {
  return (
    <div className={`field-form-item ${className}`}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <span className="field-label">{label}</span>}
          {showValue && (
            <span className="field-text-sm field-text-secondary" style={{ fontFamily: 'var(--field-font-mono)' }}>
              {value}
              {valueSuffix}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="field-slider"
      />
    </div>
  );
};
