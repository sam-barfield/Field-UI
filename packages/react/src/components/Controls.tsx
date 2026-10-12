'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronUp, ChevronDown, X, Minus } from 'lucide-react';
import {
  mergeRefs,
  useAnchoredPosition,
  useControllableState,
  useDismissableLayer,
  useIsomorphicLayoutEffect,
} from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';
import { applyResponsive, createResponsiveAccumulator, resolveSpace, type Responsive, type SpaceValue } from '../utils/responsive.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { FieldLabel, FieldMessage, getFieldDescriptionId, type FieldControlSize } from './Input.js';

type NativeCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'checked' | 'defaultChecked' | 'size' | 'children'
>;

/* --- SWITCH --- */
export interface SwitchProps extends NativeCheckboxProps {
  label?: React.ReactNode;
  /** Secondary text under the label. */
  description?: React.ReactNode;
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state when toggled. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * An on/off toggle for settings that apply immediately. Backed by a native
 * `<input type="checkbox" role="switch">`, so it is keyboard accessible,
 * labelled by its text and submits with forms.
 *
 * @example
 * <Switch label="Auto-scaling" description="Add capacity under load" checked={on} onChange={setOn} />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      size = 'md',
      className = '',
      id: customId,
      style,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const [checked, setChecked] = useState(defaultChecked);
    const isOn = controlledChecked ?? checked;

    return (
      <label
        htmlFor={id}
        className={mergeClassNames('field-switch-root', disabled && 'disabled', className)}
        style={style}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          className="field-control-input"
          checked={isOn}
          disabled={disabled}
          aria-describedby={description ? `${id}-desc` : undefined}
          onChange={e => {
            if (controlledChecked === undefined) setChecked(e.target.checked);
            onChange?.(e.target.checked, e);
          }}
          {...inputProps}
        />
        <span
          className={mergeClassNames('field-switch', size === 'sm' && 'field-switch-sm', isOn && 'checked')}
          aria-hidden="true"
        >
          <span className="field-switch-thumb" />
        </span>
        {(label || description) && (
          <span className="field-control-text">
            {label && <span className="field-control-label">{label}</span>}
            {description && (
              <span id={`${id}-desc`} className="field-helper-text">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

/* --- CHECKBOX --- */
export interface CheckboxProps extends NativeCheckboxProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  /** Shows a dash and reports "mixed" to assistive tech (e.g. a partially selected "select all"). */
  indeterminate?: boolean;
  /** Error message shown under the checkbox; also sets `aria-invalid` and links the message with `aria-describedby`. */
  error?: React.ReactNode;
  className?: string;
}

/**
 * A native checkbox with Field styling. Pass `aria-label` when there is no
 * visible `label` (e.g. row selection in a table).
 *
 * @example
 * <Checkbox label="I accept the terms" checked={accepted} onChange={setAccepted} />
 * <Checkbox id="consent" required label="I agree to the privacy policy" error={errors.consent} />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      indeterminate = false,
      error,
      className = '',
      id: customId,
      style,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(defaultChecked);
    const isChecked = controlledChecked ?? checked;

    useIsomorphicLayoutEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const describedBy =
      [description && `${id}-desc`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

    const control = (
      <label
        htmlFor={id}
        className={mergeClassNames('field-checkbox-root', disabled && 'disabled', !!error && 'error', className)}
        style={style}
      >
        <input
          ref={mergeRefs(inputRef, ref)}
          id={id}
          type="checkbox"
          className="field-control-input"
          checked={isChecked}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={e => {
            if (controlledChecked === undefined) setChecked(e.target.checked);
            onChange?.(e.target.checked, e);
          }}
          {...inputProps}
        />
        <span
          className={mergeClassNames(
            'field-checkbox',
            (isChecked || indeterminate) && 'checked',
            indeterminate && 'indeterminate'
          )}
          aria-hidden="true"
        >
          {indeterminate ? (
            <Minus size={12} strokeWidth={3} />
          ) : (
            isChecked && <Check size={13} strokeWidth={2.75} />
          )}
        </span>
        {(label || description) && (
          <span className="field-control-text">
            {label && <span className="field-control-label">{label}</span>}
            {description && (
              <span id={`${id}-desc`} className="field-helper-text">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );

    if (!error) return control;
    // The message sits outside the <label> so it is not read as part of the checkbox's name.
    return (
      <div className="field-checkbox-field">
        {control}
        <FieldMessage id={id} error={error} />
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* --- RADIO GROUP --- */
export interface RadioOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string = string> {
  label?: React.ReactNode;
  options: RadioOption<T>[];
  /** Controlled value. */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue?: T;
  onChange?: (val: T) => void;
  disabled?: boolean;
  /** Stack options vertically (default) or lay them out in a row. */
  orientation?: 'vertical' | 'horizontal';
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  /** Form field name. Generated automatically if omitted. */
  name?: string;
  required?: boolean;
  'aria-label'?: string;
}

/**
 * A set of mutually exclusive options. Uses native radio inputs, so arrow
 * keys move the selection and the group submits with forms.
 *
 * @example
 * <RadioGroup label="Plan" value={plan} onChange={setPlan} options={[
 *   { value: 'free', label: 'Free' },
 *   { value: 'pro', label: 'Pro', description: '$12 / month' },
 * ]} />
 */
export function RadioGroup<T extends string = string>(props: Readonly<RadioGroupProps<T>>) {
  const {
    label,
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    disabled = false,
    orientation = 'vertical',
    helperText,
    error,
    className = '',
    name,
    required,
    'aria-label': ariaLabel,
  } = props;
  const generatedId = useId();
  const groupName = name || generatedId;
  const [value, setValue] = useControllableState<T | undefined>({
    value: controlledValue,
    defaultValue,
    onChange: onChange as ((v: T | undefined) => void) | undefined,
  });

  return (
    <div
      className={mergeClassNames('field-form-item', className)}
      role="radiogroup"
      aria-labelledby={label ? `${generatedId}-label` : undefined}
      aria-label={!label ? ariaLabel : undefined}
      aria-describedby={getFieldDescriptionId(generatedId, error, helperText)}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
    >
      {label && (
        <span id={`${generatedId}-label`} className="field-label">
          {label}
          {required && (
            <span className="field-label-required" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      <div className={mergeClassNames('field-radio-group', orientation === 'horizontal' && 'horizontal')}>
        {options.map(opt => {
          const isSelected = opt.value === value;
          const isDisabled = disabled || opt.disabled;
          const optionId = `${generatedId}-${opt.value}`;
          return (
            <label key={opt.value} htmlFor={optionId} className={mergeClassNames('field-radio-item', isDisabled && 'disabled')}>
              <input
                id={optionId}
                type="radio"
                className="field-control-input"
                name={groupName}
                value={opt.value}
                checked={isSelected}
                disabled={isDisabled}
                required={required}
                aria-describedby={opt.description ? `${optionId}-desc` : undefined}
                onChange={() => setValue(opt.value)}
              />
              <span
                className={mergeClassNames('field-radio-button', isSelected && 'checked', isDisabled && 'disabled')}
                aria-hidden="true"
              >
                {isSelected && <span className="field-radio-dot" />}
              </span>
              <span className="field-radio-content">
                <span className="field-radio-label">{opt.label}</span>
                {opt.description && (
                  <span id={`${optionId}-desc`} className="field-radio-desc">
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <FieldMessage id={generatedId} error={error} helperText={helperText} />
    </div>
  );
}

/* --- SLIDER & LEVEL ZONES --- */
export interface SliderZone {
  /** Start of the zone. Defaults to the end of the previous zone (or `min`). */
  from?: number;
  /** End of the zone (inclusive). */
  to: number;
  /** Status keyword or any CSS colour. */
  color?: 'success' | 'warning' | 'danger' | 'accent' | (string & {});
  /** Shown as a badge while the value is inside this zone. */
  label?: string;
}

export interface SliderProps {
  label?: React.ReactNode;
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. */
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  /** Colour-coded ranges, e.g. healthy / warning / critical thresholds. */
  zones?: SliderZone[];
  /** Show zone boundary values under the track. */
  showMarks?: boolean;
  /** Soft glow around the fill and thumb. */
  glow?: boolean;
  disabled?: boolean;
  /** Show the current value in the header. Default `true`. */
  showValue?: boolean;
  /** Appended to the displayed value, e.g. `%` or ` GB`. */
  valueSuffix?: string;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  required?: boolean;
  'aria-label'?: string;
}

const resolveColor = (c?: string): string => {
  if (!c) return 'var(--field-accent-primary)';
  switch (c) {
    case 'success': return 'var(--field-status-success-base)';
    case 'warning': return 'var(--field-status-warning-base)';
    case 'danger': return 'var(--field-status-danger-base)';
    case 'accent': return 'var(--field-accent-primary)';
    default: return c;
  }
};

/**
 * A range input with optional colour-coded threshold zones. Built on a native
 * `<input type="range">` for keyboard and screen-reader support.
 *
 * @example
 * <Slider label="CPU alarm" valueSuffix="%" value={cpu} onChange={setCpu}
 *   zones={[{ to: 60, color: 'success', label: 'Healthy' }, { to: 85, color: 'warning' }, { to: 100, color: 'danger' }]} />
 */
export const Slider: React.FC<SliderProps> = ({
  label,
  value: controlledValue,
  defaultValue,
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
  id: customId,
  required,
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [value, setValue] = useControllableState<number>({
    value: controlledValue,
    defaultValue: defaultValue ?? min,
    onChange,
  });
  const rangeSpan = Math.max(1, max - min);
  const clampedValue = Math.min(max, Math.max(min, value));
  const valuePercent = ((clampedValue - min) / rangeSpan) * 100;

  const resolvedZones = React.useMemo(() => {
    if (!zones || zones.length === 0) return null;
    let currentFrom = min;
    return zones.map(z => {
      const from = z.from ?? currentFrom;
      const to = Math.min(max, z.to);
      currentFrom = to;
      return { from, to, color: resolveColor(z.color), label: z.label };
    });
  }, [zones, min, max]);

  const activeZone = React.useMemo(() => {
    if (!resolvedZones) return null;
    return (
      resolvedZones.find(z => clampedValue >= z.from && clampedValue <= z.to) ||
      resolvedZones[resolvedZones.length - 1]
    );
  }, [resolvedZones, clampedValue]);

  const activeColor = activeZone ? activeZone.color : 'var(--field-accent-primary)';
  const valueText = `${clampedValue}${valueSuffix}${activeZone?.label ? ` (${activeZone.label})` : ''}`;

  return (
    <div
      className={mergeClassNames('field-slider-container', disabled && 'disabled', className)}
      style={style}
    >
      {(label || showValue) && (
        <div className="field-slider-header">
          <div className="field-slider-header-label">
            {label && (
              <label htmlFor={id} id={`${id}-label`} className="field-label">
                {label}
              </label>
            )}
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
              style={{ color: activeZone ? activeColor : 'var(--field-text-primary)' }}
              aria-hidden="true"
            >
              {clampedValue}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div className="field-slider-track-wrapper">
        <div className="field-slider-track-bg">
          {resolvedZones ? (
            resolvedZones.map(zone => {
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

        <div
          className="field-slider-track-fill"
          style={{
            width: `${valuePercent}%`,
            backgroundColor: activeColor,
            boxShadow: glow ? `0 0 8px color-mix(in srgb, ${activeColor} 50%, transparent)` : 'none',
          }}
        />

        {resolvedZones && resolvedZones.length > 1 && (
          <div className="field-slider-threshold-lines">
            {resolvedZones.slice(0, -1).map(zone => {
              const linePercent = ((zone.to - min) / rangeSpan) * 100;
              const isReached = clampedValue >= zone.to;
              return (
                <div
                  key={`line-${zone.to}`}
                  className={`field-slider-threshold-line ${isReached ? 'reached' : 'unreached'}`}
                  style={{
                    left: `${linePercent}%`,
                    backgroundColor: isReached
                      ? 'var(--field-surface-base)'
                      : `color-mix(in srgb, ${zone.color} 75%, transparent)`,
                  }}
                />
              );
            })}
          </div>
        )}

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
          onChange={e => setValue(Number(e.target.value))}
          className="field-slider-input"
          style={{
            '--thumb-color': activeColor,
            '--thumb-glow': glow ? `0 0 10px ${activeColor}` : 'none',
          } as React.CSSProperties}
          aria-label={!label ? ariaLabel ?? 'Value' : undefined}
          aria-valuetext={valueText}
        />
      </div>

      {showMarks && resolvedZones && (
        <div className="field-slider-marks" aria-hidden="true">
          {resolvedZones.map(zone => {
            const markPercent = ((zone.to - min) / rangeSpan) * 100;
            return (
              <span
                key={`mark-${zone.to}`}
                className={mergeClassNames('field-slider-mark', markPercent >= 95 && 'end', markPercent <= 5 && 'start')}
                style={{ left: `${markPercent}%` }}
              >
                {zone.to}
                {valueSuffix}
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
  /** Called with the committed (clamped, step-rounded) number. */
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Height matching the Button of the same size (`sm` 30px, `md` 36px, `lg` 44px, `xl` 48px). Default `md`. */
  size?: FieldControlSize;
  /** Width of the field (number = px, or any CSS length). */
  width?: number | string;
  /** Stretch to the container width. Default `false`. */
  isFullWidth?: boolean;
  /** Unit label shown inside the field, e.g. `GB`. */
  unit?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  'aria-label'?: string;
}

const decimalsOf = (n: number) => {
  const str = String(n);
  const dot = str.indexOf('.');
  return dot === -1 ? 0 : str.length - dot - 1;
};

/**
 * A numeric field with stepper buttons. Typing is free-form; the value is
 * clamped to `min`/`max` and committed on blur or Enter. Arrow keys step.
 *
 * @example
 * <NumberInput label="Instances" min={1} max={20} value={count} onChange={setCount} />
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      size = 'md',
      width,
      isFullWidth = false,
      unit,
      label,
      helperText,
      error,
      disabled = false,
      className = '',
      style,
      name,
      id: customId,
      required,
      placeholder,
      onBlur,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const [currentVal, setCurrentVal] = useControllableState<number>({
      value: controlledValue,
      defaultValue,
      onChange,
    });
    const [draft, setDraft] = useState<string | null>(null);
    const precision = Math.max(decimalsOf(step), decimalsOf(min === -Infinity ? 0 : min));

    const normalize = (val: number) => {
      const clamped = Math.min(Math.max(val, min), max);
      return Number(clamped.toFixed(precision));
    };

    const commit = (val: number) => {
      const next = normalize(val);
      setDraft(null);
      if (next !== currentVal) setCurrentVal(next);
    };

    const commitDraft = () => {
      if (draft === null) return;
      const parsed = Number.parseFloat(draft);
      if (Number.isNaN(parsed)) setDraft(null);
      else commit(parsed);
    };

    const handleStep = (direction: 1 | -1) => {
      if (disabled) return;
      const base = draft !== null && !Number.isNaN(Number.parseFloat(draft)) ? Number.parseFloat(draft) : currentVal;
      commit(base + direction * step);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleStep(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleStep(-1);
      } else if (e.key === 'Enter') {
        commitDraft();
      } else if (e.key === 'Escape' && draft !== null) {
        setDraft(null);
      }
    };

    const describedBy = getFieldDescriptionId(id, error, helperText);
    const displayValue = draft ?? (Number.isNaN(currentVal) ? '' : String(currentVal));

    const wrapperStyle: React.CSSProperties = {
      ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
      ...(isFullWidth ? { width: '100%' } : {}),
    };

    return (
      <div className={mergeClassNames('field-form-item', isFullWidth && 'field-form-item-full', className)} style={style}>
        {label && (
          <FieldLabel htmlFor={id} required={required}>
            {label}
          </FieldLabel>
        )}
        <div
          className={mergeClassNames(
            'field-number-input-wrapper',
            `field-number-input-${size}`,
            isFullWidth && 'full-width',
            error && 'error',
            disabled && 'disabled'
          )}
          style={wrapperStyle}
        >
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            role="spinbutton"
            name={name}
            id={id}
            required={required}
            placeholder={placeholder}
            className="field-number-input"
            value={displayValue}
            disabled={disabled}
            aria-label={!label ? ariaLabel : undefined}
            aria-valuenow={Number.isNaN(currentVal) ? undefined : currentVal}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={e => setDraft(e.target.value)}
            onBlur={e => {
              commitDraft();
              onBlur?.(e);
            }}
            onKeyDown={handleKeyDown}
          />
          {unit && <span className="field-number-input-unit">{unit}</span>}
          <div className="field-number-input-stepper">
            <button
              type="button"
              tabIndex={-1}
              className="field-number-stepper-btn"
              disabled={disabled || currentVal >= max}
              onClick={() => handleStep(1)}
              aria-label="Increase value"
            >
              <ChevronUp size={12} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="field-number-stepper-btn"
              disabled={disabled || currentVal <= min}
              onClick={() => handleStep(-1)}
              aria-label="Decrease value"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
        <FieldMessage id={id} error={error} helperText={helperText} />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

/* --- COMBOBOX / MULTI-SELECT --- */
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Controlled list of selected values. */
  value?: string[];
  /** Initial selection when uncontrolled. */
  defaultValue?: string[];
  onChange?: (val: string[]) => void;
  placeholder?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  /** Renders one hidden input per selected value for native form submission. */
  name?: string;
  id?: string;
  required?: boolean;
  /** Text shown when the search matches nothing. */
  emptyMessage?: React.ReactNode;
  'aria-label'?: string;
  container?: HTMLElement | null;
}

/**
 * A searchable multi-select: type to filter, Enter or click to toggle, chips
 * show the selection and Backspace removes the last one.
 *
 * @example
 * <Combobox label="Tags" options={tags} value={selected} onChange={setSelected} />
 */
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
  id: customId,
  required,
  emptyMessage = 'No options found',
  'aria-label': ariaLabel,
  container,
}) => {
  const [currentValues, setValues] = useControllableState<string[]>({
    value: controlledValue,
    defaultValue,
    onChange,
  });
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const controlRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const id = customId || generatedId;
  const listboxId = `${id}-listbox`;
  const portalProps = usePortalThemeProps('field-select-dropdown');
  const { style: floatingStyle } = useAnchoredPosition(controlRef, listRef, isOpen, { matchWidth: true, offset: 4 });

  useDismissableLayer(isOpen, { refs: [controlRef, listRef], onDismiss: () => setIsOpen(false) });

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    setActiveIndex(prev => Math.min(prev, Math.max(0, filteredOptions.length - 1)));
  }, [filteredOptions.length]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  const toggleOption = (val: string) => {
    setValues(currentValues.includes(val) ? currentValues.filter(v => v !== val) : [...currentValues, val]);
    setSearch('');
    inputRef.current?.focus();
  };

  const removeValue = (val: string) => {
    setValues(currentValues.filter(v => v !== val));
    inputRef.current?.focus();
  };

  const moveActive = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) return;
    let next = activeIndex;
    for (let i = 0; i < filteredOptions.length; i++) {
      next = (next + direction + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[next].disabled) break;
    }
    setActiveIndex(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else moveActive(-1);
        break;
      case 'Enter': {
        if (!isOpen) return;
        e.preventDefault();
        const opt = filteredOptions[activeIndex];
        if (opt && !opt.disabled) toggleOption(opt.value);
        break;
      }
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
        }
        break;
      case 'Backspace':
        if (search === '' && currentValues.length > 0) {
          setValues(currentValues.slice(0, -1));
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const describedBy = getFieldDescriptionId(id, error, helperText);
  const portalTarget = getPortalTarget(container);
  const activeOption = filteredOptions[activeIndex];

  return (
    <div className={mergeClassNames('field-form-item', className)}>
      {name && currentValues.map(val => <input key={val} type="hidden" name={name} value={val} />)}
      {label && (
        <FieldLabel htmlFor={id} required={required}>
          {label}
        </FieldLabel>
      )}
      <div
        ref={controlRef}
        className={mergeClassNames('field-combobox-container', error && 'error', disabled && 'disabled', isOpen && 'open')}
        onMouseDown={e => {
          if (disabled || e.target === inputRef.current) return;
          e.preventDefault();
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        {currentValues.map(val => {
          const opt = options.find(o => o.value === val);
          const text = opt ? opt.label : val;
          return (
            <span key={val} className="field-tag-chip">
              <span>{text}</span>
              {!disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  className="field-tag-chip-remove"
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => removeValue(val)}
                  aria-label={`Remove ${text}`}
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
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && activeOption ? `${id}-option-${activeIndex}` : undefined}
          aria-label={!label ? ariaLabel : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="field-combobox-input"
          value={search}
          disabled={disabled}
          placeholder={currentValues.length === 0 ? placeholder : ''}
          autoComplete="off"
          onChange={e => {
            setSearch(e.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onClick={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen &&
        portalTarget &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            {...portalProps}
            style={{ ...portalProps.style, ...floatingStyle }}
          >
            {filteredOptions.length === 0 ? (
              <li className="field-select-empty">{emptyMessage}</li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = currentValues.includes(opt.value);
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
                    onClick={() => !opt.disabled && toggleOption(opt.value)}
                  >
                    <span className="field-select-option-text">{opt.label}</span>
                    {isSelected && <Check size={14} className="field-select-check" aria-hidden="true" />}
                  </li>
                );
              })
            )}
          </ul>,
          portalTarget
        )}

      <FieldMessage id={id} error={error} helperText={helperText} />
    </div>
  );
};

/* --- CHIP / FILTER CHIP (F20) --- */
export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  children: React.ReactNode;
  /** Whether the chip is toggled on / active. */
  selected?: boolean;
  /** Initial selected state when uncontrolled. */
  defaultSelected?: boolean;
  /** Called when the toggle state changes. */
  onSelectedChange?: (selected: boolean) => void;
  /** Optional badge or item count displayed in the chip. */
  count?: React.ReactNode;
  /** Visual variant. Default `default`. */
  variant?: 'default' | 'accent' | 'outline';
  /** Height matching the Button of the same size: `sm` 30px, `md` 36px (default), `lg` 44px. */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Filter chip / toggle button with optional count, keyboard support and accessible aria-pressed state.
 *
 * @example
 * <Chip selected={filter === 'ww2'} onSelectedChange={() => setFilter('ww2')} count={24}>
 *   WWII Era
 * </Chip>
 */
export const Chip: React.FC<ChipProps> = ({
  children,
  selected: controlledSelected,
  defaultSelected = false,
  onSelectedChange,
  count,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  style,
  onClick,
  ...props
}) => {
  const [selected, setSelected] = useControllableState({
    value: controlledSelected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setSelected(!selected);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={handleClick}
      className={mergeClassNames(
        'field-chip',
        `field-chip-${size}`,
        `field-chip-${variant}`,
        selected && 'selected',
        disabled && 'disabled',
        className
      )}
      style={style}
      {...props}
    >
      <span className="field-chip-label">{children}</span>
      {count !== undefined && count !== null && (
        <span className="field-chip-count">{count}</span>
      )}
    </button>
  );
};

Chip.displayName = 'Chip';

/* --- CHIP GROUP (F20) --- */
export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Allow horizontal touch scrolling on mobile without wrapping. Default `true`. */
  scroll?: boolean;
  /** Gap between chips: px number, CSS length or `$` spacing token; accepts a breakpoint object. Default `$2` (8px). */
  gap?: Responsive<SpaceValue>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Horizontal grouping of filter chips with automatic touch scrolling on small screens.
 *
 * @example
 * <ChipGroup scroll>
 *   <Chip selected count={12}>All</Chip>
 *   <Chip count={4}>Photographs</Chip>
 *   <Chip count={8}>Documents</Chip>
 * </ChipGroup>
 */
export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  scroll = true,
  gap,
  className = '',
  style,
  ...props
}) => {
  const acc = createResponsiveAccumulator();
  applyResponsive(acc, 'gap', 'gap', gap, resolveSpace, '$2');
  const computedStyle = { ...acc.style, ...style } as React.CSSProperties;

  return (
    <div
      role="group"
      className={mergeClassNames(
        'field-chip-group',
        scroll && 'field-chip-group-scroll',
        ...acc.classes,
        className
      )}
      style={computedStyle}
      {...props}
    >
      {children}
    </div>
  );
};

ChipGroup.displayName = 'ChipGroup';

