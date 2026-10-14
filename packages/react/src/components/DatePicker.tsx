'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { useAnchoredPosition, useControllableState, useDismissableLayer } from '../utils/hooks.js';
import { mergeClassNames } from '../utils/polymorphic.js';
import { FieldLabel } from './Input.js';
import { startOfDay, toISODateString } from '../utils/date.js';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/* --- Date helpers (all comparisons are by calendar day, ignoring time) --- */

const dayValue = (d: Date) => startOfDay(d).getTime();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
};

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean =>
  Boolean(a && b && dayValue(a) === dayValue(b));

const isBetween = (target: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const t = dayValue(target);
  return t > dayValue(start) && t < dayValue(end);
};

export { toISODateString };

const defaultFormat = (date: Date): string =>
  `${MONTH_NAMES[date.getMonth()].substring(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;

const fullDateLabel = (date: Date) =>
  `${DAY_NAMES_LONG[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
const DAY_NAMES_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* --- Shared calendar grid --- */

interface CalendarProps {
  /** Day that holds keyboard focus (and decides the visible month). */
  focusedDate: Date;
  onFocusedDateChange: (date: Date) => void;
  onSelect: (date: Date) => void;
  isDisabled: (date: Date) => boolean;
  getDayClassName: (date: Date) => string;
  isSelected: (date: Date) => boolean;
  onHover?: (date: Date | null) => void;
  /** Focus the focused day on mount (when the popover opens). */
  autoFocus?: boolean;
  labelId: string;
}

const Calendar: React.FC<CalendarProps> = ({
  focusedDate,
  onFocusedDateChange,
  onSelect,
  isDisabled,
  getDayClassName,
  isSelected,
  onHover,
  autoFocus,
  labelId,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(Boolean(autoFocus));
  const viewYear = focusedDate.getFullYear();
  const viewMonth = focusedDate.getMonth();

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus({ preventScroll: true });
  }, [focusedDate]);

  const moveFocus = (next: Date) => {
    shouldFocus.current = true;
    onFocusedDateChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft': next = addDays(focusedDate, -1); break;
      case 'ArrowRight': next = addDays(focusedDate, 1); break;
      case 'ArrowUp': next = addDays(focusedDate, -7); break;
      case 'ArrowDown': next = addDays(focusedDate, 7); break;
      case 'Home': next = addDays(focusedDate, -focusedDate.getDay()); break;
      case 'End': next = addDays(focusedDate, 6 - focusedDate.getDay()); break;
      case 'PageUp': next = addMonths(focusedDate, e.shiftKey ? -12 : -1); break;
      case 'PageDown': next = addMonths(focusedDate, e.shiftKey ? 12 : 1); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isDisabled(focusedDate)) onSelect(focusedDate);
        return;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d))
  );
  const today = new Date();

  return (
    <>
      <div className="field-datepicker-header">
        <button
          type="button"
          className="field-datepicker-nav-btn"
          onClick={() => onFocusedDateChange(addMonths(focusedDate, -1))}
          aria-label="Previous month"
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        <div id={labelId} className="field-datepicker-current-month" aria-live="polite">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          className="field-datepicker-nav-btn"
          onClick={() => onFocusedDateChange(addMonths(focusedDate, 1))}
          aria-label="Next month"
        >
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>

      <div ref={gridRef} role="grid" aria-labelledby={labelId} onKeyDown={handleKeyDown} onMouseLeave={() => onHover?.(null)}>
        <div role="row" className="field-datepicker-weekdays">
          {DAY_NAMES.map((d, i) => (
            <div key={d} role="columnheader" className="field-datepicker-weekday" aria-label={DAY_NAMES_LONG[i]}>
              {d}
            </div>
          ))}
        </div>
        <div className="field-datepicker-grid" role="rowgroup">
          {weeks.map(week => (
            <div role="row" key={week[0].toDateString()} className="field-datepicker-week">
              {week.map(date => {
                const disabled = isDisabled(date);
                const isFocused = isSameDay(date, focusedDate);
                const inMonth = date.getMonth() === viewMonth;
                return (
                  <div role="gridcell" key={date.toDateString()} aria-selected={isSelected(date) || undefined}>
                    <button
                      type="button"
                      tabIndex={isFocused ? 0 : -1}
                      disabled={disabled}
                      aria-label={fullDateLabel(date)}
                      aria-current={isSameDay(date, today) ? 'date' : undefined}
                      className={mergeClassNames(
                        'field-datepicker-day',
                        inMonth ? 'current-month' : 'other-month',
                        isSameDay(date, today) && 'today',
                        getDayClassName(date)
                      )}
                      onClick={() => {
                        onFocusedDateChange(date);
                        onSelect(date);
                      }}
                      onMouseEnter={() => onHover?.(date)}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* --- Shared popover behaviour --- */

function useCalendarPopover(disabled: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { style } = useAnchoredPosition(triggerRef, popoverRef, isOpen, { offset: 6 });

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };
  useDismissableLayer(isOpen, { refs: [triggerRef, popoverRef], onDismiss: () => close(true) });

  return {
    isOpen,
    open: () => !disabled && setIsOpen(true),
    close,
    triggerRef,
    popoverRef,
    floatingStyle: style,
  };
}

const makeDisabledCheck = (minDate?: Date, maxDate?: Date) => (date: Date) =>
  (minDate !== undefined && dayValue(date) < dayValue(minDate)) ||
  (maxDate !== undefined && dayValue(date) > dayValue(maxDate));

/* --- DatePicker --- */

export interface DatePickerProps {
  label?: React.ReactNode;
  /** Controlled value. */
  value?: Date | null;
  /** Initial value when uncontrolled. */
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  /** Earliest selectable day (time of day is ignored). */
  minDate?: Date;
  /** Latest selectable day (time of day is ignored). */
  maxDate?: Date;
  disabled?: boolean;
  /** Show a clear (×) button when a date is set. Default `true`. */
  clearable?: boolean;
  /** Keep the calendar open after picking and show a Done button. */
  showDoneButton?: boolean;
  showCloseButton?: boolean;
  doneButtonLabel?: string;
  onDone?: () => void;
  /** Custom display format for the trigger. */
  formatDate?: (date: Date) => string;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Submits the date as local `YYYY-MM-DD` under this name. */
  name?: string;
  id?: string;
  required?: boolean;
  container?: HTMLElement | null;
}

/**
 * A date field with a keyboard-accessible calendar popover (arrows move by
 * day/week, PageUp/PageDown by month, Enter selects, Escape closes).
 *
 * @example
 * <DatePicker label="Start date" value={date} onChange={setDate} minDate={new Date()} />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder = 'Select date...',
  minDate,
  maxDate,
  disabled = false,
  clearable = true,
  showDoneButton = false,
  showCloseButton = false,
  doneButtonLabel = 'Done',
  onDone,
  formatDate = defaultFormat,
  helperText,
  error,
  className = '',
  style,
  name,
  id: customId,
  required,
  container,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [value, setValue] = useControllableState<Date | null>({ value: controlledValue, defaultValue, onChange });
  const [focusedDate, setFocusedDate] = useState<Date>(() => value ?? new Date());
  const popover = useCalendarPopover(disabled);
  const portalProps = usePortalThemeProps('field-datepicker-popover');
  const isDisabled = makeDisabledCheck(minDate, maxDate);

  const handleOpen = () => {
    const today = new Date();
    setFocusedDate(value ?? (isDisabled(today) && minDate ? minDate : today));
    popover.open();
  };

  const select = (date: Date | null) => {
    setValue(date);
    if (!showDoneButton) popover.close();
  };

  const portalTarget = getPortalTarget(container);
  const today = new Date();
  const descriptionId = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <div className={mergeClassNames('field-datepicker', disabled && 'disabled', className)} style={style}>
      {name && <input type="hidden" name={name} value={toISODateString(value)} required={required} />}
      {label && (
        <FieldLabel htmlFor={id} required={required} className="field-datepicker-label">
          {label}
        </FieldLabel>
      )}

      <div className="field-datepicker-trigger-wrapper">
        <button
          type="button"
          ref={popover.triggerRef}
          id={id}
          aria-haspopup="dialog"
          aria-expanded={popover.isOpen}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionId}
          disabled={disabled}
          className={mergeClassNames(
            'field-datepicker-trigger',
            popover.isOpen && 'active',
            error && 'error',
            clearable && value && !disabled && 'has-clear'
          )}
          onClick={() => (popover.isOpen ? popover.close(false) : handleOpen())}
        >
          <CalendarIcon size={15} className="field-datepicker-icon" aria-hidden="true" />
          <span className={mergeClassNames('field-datepicker-value', !value && 'placeholder')}>
            {value ? formatDate(value) : placeholder}
          </span>
        </button>

        {clearable && value && !disabled && (
          <button type="button" className="field-datepicker-clear" onClick={() => setValue(null)} aria-label="Clear date">
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && <span id={`${id}-error`} className="field-error-text" role="alert">{error}</span>}
      {!error && helperText && <span id={`${id}-helper`} className="field-helper-text">{helperText}</span>}

      {popover.isOpen &&
        portalTarget &&
        createPortal(
          <div
            ref={popover.popoverRef}
            role="dialog"
            aria-label="Choose date"
            {...portalProps}
            style={{ ...portalProps.style, ...popover.floatingStyle }}
          >
            <Calendar
              labelId={`${id}-month`}
              autoFocus
              focusedDate={focusedDate}
              onFocusedDateChange={setFocusedDate}
              onSelect={select}
              isDisabled={isDisabled}
              isSelected={date => isSameDay(date, value)}
              getDayClassName={date => (isSameDay(date, value) ? 'selected' : '')}
            />

            <div className="field-datepicker-footer">
              <div className="field-datepicker-footer-group">
                <button
                  type="button"
                  className="field-datepicker-action-btn"
                  disabled={isDisabled(today)}
                  onClick={() => select(startOfDay(today))}
                >
                  Today
                </button>
                {value && (
                  <button type="button" className="field-datepicker-action-btn clear" onClick={() => select(null)}>
                    Clear
                  </button>
                )}
              </div>
              <div className="field-datepicker-footer-group">
                {showCloseButton && (
                  <button type="button" className="field-datepicker-action-btn" onClick={() => popover.close()}>
                    Close
                  </button>
                )}
                {showDoneButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn primary"
                    onClick={() => {
                      onDone?.();
                      popover.close();
                    }}
                  >
                    {doneButtonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          portalTarget
        )}
    </div>
  );
};

/* --- DateRangePicker --- */

export interface DateRangePreset {
  label: string;
  /** Called when the preset is clicked; return the range to select. */
  range: () => DateRange;
}

const lastNDays = (n: number): DateRange => {
  const end = startOfDay(new Date());
  return { start: addDays(end, -(n - 1)), end };
};

/** The `DateRangePicker` presets shown by default: last 7, 30 and 90 days, ending today. Spread it to add your own. */
export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  { label: 'Last 7 days', range: () => lastNDays(7) },
  { label: 'Last 30 days', range: () => lastNDays(30) },
  { label: 'Last 90 days', range: () => lastNDays(90) },
];

export interface DateRangePickerProps {
  label?: React.ReactNode;
  /** Controlled range. */
  value?: DateRange;
  /** Initial range when uncontrolled. */
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** Quick-pick buttons. Pass `[]` to hide them. Defaults to last 7/30/90 days. */
  presets?: DateRangePreset[];
  showDoneButton?: boolean;
  showCloseButton?: boolean;
  doneButtonLabel?: string;
  onDone?: () => void;
  formatDate?: (date: Date) => string;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Submits `${name}_start` and `${name}_end` as local `YYYY-MM-DD`. */
  name?: string;
  id?: string;
  required?: boolean;
  container?: HTMLElement | null;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };

/**
 * Pick a start and end date. The first click sets the start, the second the
 * end (order is normalised); hovering previews the range.
 *
 * @example
 * <DateRangePicker label="Billing period" value={range} onChange={setRange} />
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  value: controlledValue,
  defaultValue = EMPTY_RANGE,
  onChange,
  placeholder = 'Select date range...',
  minDate,
  maxDate,
  disabled = false,
  presets = DEFAULT_DATE_RANGE_PRESETS,
  showDoneButton = false,
  showCloseButton = false,
  doneButtonLabel = 'Done',
  onDone,
  formatDate = defaultFormat,
  helperText,
  error,
  className = '',
  style,
  name,
  id: customId,
  required,
  container,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [value, setValue] = useControllableState<DateRange>({ value: controlledValue, defaultValue, onChange });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date>(() => value.start ?? new Date());
  const popover = useCalendarPopover(disabled);
  const portalProps = usePortalThemeProps('field-datepicker-popover range-popover');
  const isDisabled = makeDisabledCheck(minDate, maxDate);

  const handleOpen = () => {
    setFocusedDate(value.start ?? new Date());
    setHoverDate(null);
    popover.open();
  };

  const handleDayClick = (date: Date) => {
    if (!value.start || value.end) {
      setValue({ start: date, end: null });
      return;
    }
    setValue(dayValue(date) < dayValue(value.start) ? { start: date, end: value.start } : { start: value.start, end: date });
    if (!showDoneButton) popover.close();
  };

  const formatRangeLabel = (): string => {
    if (value.start && value.end) return `${formatDate(value.start)} – ${formatDate(value.end)}`;
    if (value.start) return `${formatDate(value.start)} – Select end date`;
    return placeholder;
  };

  const previewEnd = value.start && !value.end ? hoverDate : null;
  const portalTarget = getPortalTarget(container);
  const descriptionId = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <div className={mergeClassNames('field-datepicker', disabled && 'disabled', className)} style={style}>
      {name && (
        <>
          <input type="hidden" name={`${name}_start`} value={toISODateString(value.start)} required={required} />
          <input type="hidden" name={`${name}_end`} value={toISODateString(value.end)} required={required} />
        </>
      )}
      {label && (
        <FieldLabel htmlFor={id} required={required} className="field-datepicker-label">
          {label}
        </FieldLabel>
      )}

      <div className="field-datepicker-trigger-wrapper">
        <button
          type="button"
          ref={popover.triggerRef}
          id={id}
          aria-haspopup="dialog"
          aria-expanded={popover.isOpen}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionId}
          disabled={disabled}
          className={mergeClassNames(
            'field-datepicker-trigger',
            popover.isOpen && 'active',
            error && 'error',
            value.start && !disabled && 'has-clear'
          )}
          onClick={() => (popover.isOpen ? popover.close(false) : handleOpen())}
        >
          <CalendarIcon size={15} className="field-datepicker-icon" aria-hidden="true" />
          <span className={mergeClassNames('field-datepicker-value', !value.start && 'placeholder')}>
            {formatRangeLabel()}
          </span>
        </button>

        {value.start && !disabled && (
          <button
            type="button"
            className="field-datepicker-clear"
            onClick={() => setValue(EMPTY_RANGE)}
            aria-label="Clear date range"
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && <span id={`${id}-error`} className="field-error-text" role="alert">{error}</span>}
      {!error && helperText && <span id={`${id}-helper`} className="field-helper-text">{helperText}</span>}

      {popover.isOpen &&
        portalTarget &&
        createPortal(
          <div
            ref={popover.popoverRef}
            role="dialog"
            aria-label="Choose date range"
            {...portalProps}
            style={{ ...portalProps.style, ...popover.floatingStyle }}
          >
            {presets.length > 0 && (
              <div className="field-datepicker-presets">
                {presets.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className="field-datepicker-preset-btn"
                    onClick={() => {
                      const range = preset.range();
                      setValue(range);
                      if (range.start) setFocusedDate(range.start);
                      if (!showDoneButton) popover.close();
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <Calendar
              labelId={`${id}-month`}
              autoFocus
              focusedDate={focusedDate}
              onFocusedDateChange={date => {
                setFocusedDate(date);
                if (value.start && !value.end) setHoverDate(date);
              }}
              onSelect={handleDayClick}
              onHover={setHoverDate}
              isDisabled={isDisabled}
              isSelected={date => isSameDay(date, value.start) || isSameDay(date, value.end)}
              getDayClassName={date => {
                const isStart = isSameDay(date, value.start);
                const isEnd = isSameDay(date, value.end);
                let inRange = isBetween(date, value.start, value.end);
                if (previewEnd && value.start) {
                  inRange =
                    dayValue(previewEnd) >= dayValue(value.start)
                      ? isBetween(date, value.start, previewEnd)
                      : isBetween(date, previewEnd, value.start);
                }
                return mergeClassNames(isStart && 'range-start', isEnd && 'range-end', inRange && 'in-range');
              }}
            />

            <div className="field-datepicker-footer">
              <button type="button" className="field-datepicker-action-btn clear" onClick={() => setValue(EMPTY_RANGE)}>
                Clear
              </button>
              <div className="field-datepicker-footer-group">
                {showCloseButton && (
                  <button type="button" className="field-datepicker-action-btn" onClick={() => popover.close()}>
                    Close
                  </button>
                )}
                {showDoneButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn primary"
                    onClick={() => {
                      onDone?.();
                      popover.close();
                    }}
                  >
                    {doneButtonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          portalTarget
        )}
    </div>
  );
};
