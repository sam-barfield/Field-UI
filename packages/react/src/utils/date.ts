/* Calendar-day helpers shared by DatePicker and DateTile. Dates are local; times are ignored. */

/** The same calendar day at midnight, local time. */
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Local `YYYY-MM-DD` (what `<input type="date">` submits). `toISOString()` would shift by the UTC offset. */
export const toISODateString = (d: Date | null): string => {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * A `Date` or string as a local calendar day. `YYYY-MM-DD` (alone or at the start of an ISO date-time)
 * is read as that local day; `new Date('2026-11-08')` would be midnight UTC, the day before in the
 * Americas. Other strings go through `Date`. Returns `null` when the value is not a valid date.
 */
export const parseLocalDate = (value: Date | string | null | undefined): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})(?![\d])/.exec(value.trim());
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return date.getMonth() === Number(match[2]) - 1 ? date : null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
};
