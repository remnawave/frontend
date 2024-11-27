import { z } from 'zod';
import dayjs, { type Dayjs, isDayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

export type CustomDate = Dayjs;

export const date = dayjs;

export function formatDate(value: Date | CustomDate | string, format = 'DD-MM-YYYY') {
  return date(value).format(format);
}

export function formatRelativeDate(value: Date | CustomDate | string) {
  return date(value).fromNow();
}

/** Validate and transform date string to dayjs instance */
export const dateSchema = z.custom<CustomDate>((value) => {
  if (
    value instanceof Date ||
    isDayjs(value) ||
    (typeof value === 'string' && date(value).isValid())
  ) {
    return date(value);
  }

  throw new Error('Invalid date format');
});
