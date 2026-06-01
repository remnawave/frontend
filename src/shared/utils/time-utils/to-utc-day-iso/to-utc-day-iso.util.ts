import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(utc)

/**
 * Converts a date picked from a calendar (date-only semantics) into an ISO
 * string anchored at the start of that day in UTC.
 *
 * `DatePickerInput` returns a `Date` at local midnight. Calling `.toISOString()`
 * on it shifts the value by the local UTC offset, so for positive offsets
 * (e.g. UTC+3) the 1st of a month becomes the last day of the previous month.
 * That made billing records dated on the 1st fall into the wrong month and
 * disappear from the "current month" counters.
 *
 * Taking only the calendar day and re-anchoring it at UTC midnight keeps the
 * day the user actually selected, regardless of their timezone.
 */
export const toUtcDayISO = (date: Date | null | string | undefined): string | undefined => {
    if (!date) {
        return undefined
    }

    return dayjs.utc(dayjs(date).format('YYYY-MM-DD')).toISOString()
}
