import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const formatDisplayDate = (date: Date | null): string => {
  if (!date) return '';
  const m = MONTH_NAMES[date.getMonth()].substring(0, 3);
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
};

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isBetween = (target: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t > s && t < e;
};

export interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  showDoneButton?: boolean;
  showCloseButton?: boolean;
  doneButtonLabel?: string;
  onDone?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
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
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 280 });

  // Current calendar viewing month and year
  const initialView = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 330;
    const fitsBelow = rect.bottom + popoverHeight <= window.innerHeight;
    const top = fitsBelow ? rect.bottom + 6 : rect.top - popoverHeight - 6;
    setCoords({
      top: Math.max(8, top),
      left: Math.min(rect.left, window.innerWidth - 300),
      width: Math.max(rect.width, 280),
    });
  };

  const handleOpen = () => {
    if (disabled) return;
    if (value) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
    }
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleResize = () => updatePosition();

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Calendar cells generation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(viewYear, viewMonth, i),
      isCurrentMonth: true,
    });
  }

  // Next month padding
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(viewYear, viewMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const today = new Date();

  return (
    <div className={`field-datepicker ${disabled ? 'disabled' : ''} ${className}`} style={style}>
      {label && <label className="field-datepicker-label">{label}</label>}

      <div
        ref={triggerRef}
        className={`field-datepicker-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleOpen}
      >
        <CalendarIcon size={15} className="field-datepicker-icon" />
        <span className={`field-datepicker-value ${!value ? 'placeholder' : ''}`}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>

        {clearable && value && !disabled && (
          <button
            type="button"
            className="field-datepicker-clear"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
            aria-label="Clear date"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className="field-datepicker-popover"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 99999,
            }}
          >
            {/* Header: Month / Year / Prev / Next */}
            <div className="field-datepicker-header">
              <button type="button" className="field-datepicker-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={15} />
              </button>
              <div className="field-datepicker-current-month">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </div>
              <button type="button" className="field-datepicker-nav-btn" onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="field-datepicker-weekdays">
              {DAY_NAMES.map(d => (
                <div key={d} className="field-datepicker-weekday">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="field-datepicker-grid">
              {days.map((item, idx) => {
                const isSelected = isSameDay(item.date, value ?? null);
                const isToday = isSameDay(item.date, today);
                const isPastMin = minDate ? item.date < minDate : false;
                const isFutureMax = maxDate ? item.date > maxDate : false;
                const isDisabledDay = isPastMin || isFutureMax;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isDisabledDay}
                    className={`field-datepicker-day ${item.isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => {
                      onChange?.(item.date);
                      if (!showDoneButton) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {item.date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="field-datepicker-footer">
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="field-datepicker-action-btn"
                  onClick={() => {
                    onChange?.(new Date());
                    if (!showDoneButton) setIsOpen(false);
                  }}
                >
                  Today
                </button>
                {value && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn clear"
                    onClick={() => {
                      onChange?.(null);
                      if (!showDoneButton) setIsOpen(false);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {showCloseButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                )}
                {showDoneButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn primary"
                    onClick={() => {
                      onDone?.();
                      setIsOpen(false);
                    }}
                  >
                    {doneButtonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export interface DateRangePickerProps {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  showDoneButton?: boolean;
  showCloseButton?: boolean;
  doneButtonLabel?: string;
  onDone?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  value = { start: null, end: null },
  onChange,
  placeholder = 'Select date range...',
  disabled = false,
  showDoneButton = false,
  showCloseButton = false,
  doneButtonLabel = 'Done',
  onDone,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const initialDate = value.start || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 350;
    const fitsBelow = rect.bottom + popoverHeight <= window.innerHeight;
    const top = fitsBelow ? rect.bottom + 6 : rect.top - popoverHeight - 6;
    setCoords({
      top: Math.max(8, top),
      left: Math.min(rect.left, window.innerWidth - 320),
    });
  };

  const handleOpen = () => {
    if (disabled) return;
    if (value.start) {
      setViewYear(value.start.getFullYear());
      setViewMonth(value.start.getMonth());
    }
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleResize = () => updatePosition();

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleDayClick = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      // Start new selection
      onChange?.({ start: date, end: null });
    } else if (value.start && !value.end) {
      // Pick end date
      if (date < value.start) {
        onChange?.({ start: date, end: value.start });
      } else {
        onChange?.({ start: value.start, end: date });
      }
      if (!showDoneButton) {
        setIsOpen(false);
      }
    }
  };

  // Days generation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(viewYear, viewMonth, i),
      isCurrentMonth: true,
    });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(viewYear, viewMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const formatRangeLabel = (): string => {
    if (value.start && value.end) {
      return `${formatDisplayDate(value.start)} — ${formatDisplayDate(value.end)}`;
    }
    if (value.start) {
      return `${formatDisplayDate(value.start)} — Select end date`;
    }
    return placeholder;
  };

  const setQuickRange = (daysCount: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysCount);
    onChange?.({ start, end });
    setIsOpen(false);
  };

  return (
    <div className={`field-datepicker ${disabled ? 'disabled' : ''} ${className}`} style={style}>
      {label && <label className="field-datepicker-label">{label}</label>}

      <div
        ref={triggerRef}
        className={`field-datepicker-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleOpen}
      >
        <CalendarIcon size={15} className="field-datepicker-icon" />
        <span className={`field-datepicker-value ${!value.start ? 'placeholder' : ''}`}>
          {formatRangeLabel()}
        </span>

        {value.start && !disabled && (
          <button
            type="button"
            className="field-datepicker-clear"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.({ start: null, end: null });
            }}
            aria-label="Clear date range"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className="field-datepicker-popover range-popover"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 99999,
            }}
          >
            {/* Quick Presets Bar */}
            <div className="field-datepicker-presets">
              <button type="button" className="field-datepicker-preset-btn" onClick={() => setQuickRange(7)}>
                Last 7 Days
              </button>
              <button type="button" className="field-datepicker-preset-btn" onClick={() => setQuickRange(30)}>
                Last 30 Days
              </button>
              <button type="button" className="field-datepicker-preset-btn" onClick={() => setQuickRange(90)}>
                Last 90 Days
              </button>
            </div>

            {/* Header */}
            <div className="field-datepicker-header">
              <button type="button" className="field-datepicker-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={15} />
              </button>
              <div className="field-datepicker-current-month">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </div>
              <button type="button" className="field-datepicker-nav-btn" onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="field-datepicker-weekdays">
              {DAY_NAMES.map(d => (
                <div key={d} className="field-datepicker-weekday">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="field-datepicker-grid">
              {days.map((item, idx) => {
                const isStart = isSameDay(item.date, value.start);
                const isEnd = isSameDay(item.date, value.end);
                const inRange = isBetween(item.date, value.start, value.end);
                const inHoverRange =
                  value.start && !value.end && hoverDate
                    ? hoverDate >= value.start
                      ? isBetween(item.date, value.start, hoverDate)
                      : isBetween(item.date, hoverDate, value.start)
                    : false;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`field-datepicker-day ${item.isCurrentMonth ? 'current-month' : 'other-month'} ${isStart ? 'range-start' : ''} ${isEnd ? 'range-end' : ''} ${inRange || inHoverRange ? 'in-range' : ''}`}
                    onClick={() => handleDayClick(item.date)}
                    onMouseEnter={() => setHoverDate(item.date)}
                  >
                    {item.date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer with Clear, Close, and Done */}
            <div className="field-datepicker-footer">
              <button
                type="button"
                className="field-datepicker-action-btn clear"
                onClick={() => {
                  onChange?.({ start: null, end: null });
                }}
              >
                Clear
              </button>
              <div style={{ display: 'flex', gap: '6px' }}>
                {showCloseButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                )}
                {showDoneButton && (
                  <button
                    type="button"
                    className="field-datepicker-action-btn primary"
                    onClick={() => {
                      onDone?.();
                      setIsOpen(false);
                    }}
                  >
                    {doneButtonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
