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

/* --- SLIDER & LEVEL ZONES --- */
export interface SliderZone {
  from?: number;
  to: number;
  color?: 'success' | 'warning' | 'danger' | 'accent' | string;
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
}) => {
  const rangeSpan = Math.max(1, max - min);
  const clampedValue = Math.min(max, Math.max(min, value));
  const valuePercent = ((clampedValue - min) / rangeSpan) * 100;

  // Resolve zones with explicit start and end boundaries
  const resolvedZones = React.useMemo(() => {
    if (!zones || zones.length === 0) return null;
    let currentFrom = min;
    return zones.map((z) => {
      const from = z.from !== undefined ? z.from : currentFrom;
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
      resolvedZones[resolvedZones.length - 1]
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
            resolvedZones.map((zone, idx) => {
              const left = ((zone.from - min) / rangeSpan) * 100;
              const width = ((zone.to - zone.from) / rangeSpan) * 100;
              return (
                <div
                  key={idx}
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
            {resolvedZones.slice(0, -1).map((zone, idx) => {
              const linePercent = ((zone.to - min) / rangeSpan) * 100;
              const isReached = clampedValue >= zone.to;
              return (
                <div
                  key={idx}
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
          {resolvedZones.map((zone, idx) => {
            const markPercent = ((zone.to - min) / rangeSpan) * 100;
            return (
              <span
                key={idx}
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
