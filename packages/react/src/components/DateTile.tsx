'use client';

import React from 'react';
import { mergeClassNames } from '../utils/polymorphic.js';
import { parseLocalDate, toISODateString } from '../utils/date.js';

export interface DateTileProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * The day shown. A `YYYY-MM-DD` string (or an ISO date-time) is read as that local day. Prefer
   * strings when rendering on the server: a `Date` made in the server's time zone can fall on a
   * different day in the visitor's.
   */
  date: Date | string;
  /**
   * Last day of a range. In the same month the tile shows both days (`8–9`); across months it keeps
   * showing the start day, so the tile stays the same size (put the full range in the text beside it).
   * Screen readers always hear the full range.
   */
  endDate?: Date | string;
  /** `sm` 2.75rem, `md` 3.5rem, `lg` 4.5rem wide. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Colour of the month strip. Default `accent`. */
  tone?: 'accent' | 'neutral';
  /** Locale for the month name and the screen-reader date. Default `en-GB`. */
  locale?: string;
}

/**
 * A calendar leaf for events, posts and bookings: the month on a coloured strip, the day below in
 * the display face. Renders a `<time>` whose screen-reader text is the full date ("Sunday 8
 * November 2026"); the visual parts are hidden from assistive technology. Put the weekday or time
 * beside it as text.
 *
 * @example
 * <DateTile date="2026-11-08" />
 * <DateTile date="2026-11-08" endDate="2026-11-09" size="lg" tone="neutral" />
 */
export const DateTile: React.FC<DateTileProps> = ({
  date,
  endDate,
  size = 'md',
  tone = 'accent',
  locale = 'en-GB',
  className = '',
  ...props
}) => {
  const start = parseLocalDate(date);
  if (!start) return null;
  const parsedEnd = parseLocalDate(endDate);
  const end = parsedEnd && parsedEnd.getTime() > start.getTime() ? parsedEnd : null;
  const sameMonth = Boolean(end && end.getFullYear() === start.getFullYear() && end.getMonth() === start.getMonth());

  const dayFormat = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(start).replace(/\.$/, '');
  const full = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const label = end ? full.formatRange(start, end) : full.format(start);
  const day = end && sameMonth ? `${dayFormat.format(start)}–${dayFormat.format(end)}` : dayFormat.format(start);

  return (
    <time
      dateTime={toISODateString(start)}
      className={mergeClassNames(
        'field-date-tile',
        `field-date-tile-${size}`,
        `field-date-tile-${tone}`,
        end && sameMonth && 'field-date-tile-range',
        className
      )}
      {...props}
    >
      <span className="field-date-tile-month" aria-hidden="true">{month}</span>
      <span className="field-date-tile-day" aria-hidden="true">{day}</span>
      <span className="field-sr-only">{label}</span>
    </time>
  );
};
