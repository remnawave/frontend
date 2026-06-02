/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/indent */
import dayjs from 'dayjs'

export function getNodeResetDaysUtil(targetDay: number): number {
    const today = dayjs()
    const nextMonth = today.add(1, 'month')

    // dayjs silently rolls overflowing days into the next month (e.g. Feb 30 ->
    // Mar 2) and keeps `isValid()` truthy, so clamp the target day to the number
    // of days in the respective month to land on the last day instead.
    const correctedThisMonth = today.date(Math.min(targetDay, today.daysInMonth()))
    const correctedNextMonth = nextMonth.date(Math.min(targetDay, nextMonth.daysInMonth()))

    const daysToThisMonth = correctedThisMonth.diff(today, 'day')
    const daysToNextMonth = correctedNextMonth.diff(today, 'day')

    const targetDate =
        daysToThisMonth < 0
            ? correctedNextMonth
            : daysToThisMonth < daysToNextMonth
              ? correctedThisMonth
              : correctedNextMonth

    return targetDate.diff(today, 'day')
}

export function getNodeResetPeriodUtil(targetDay: number): string {
    const today = dayjs()
    const prevMonth = today.subtract(1, 'month')
    const nextMonth = today.add(1, 'month')

    // Clamp the target day independently for each month, otherwise deriving the
    // previous/next reset date by adding or subtracting a month can land on the
    // wrong day when the adjacent month has a different number of days.
    const correctedPrevMonth = prevMonth.date(Math.min(targetDay, prevMonth.daysInMonth()))
    const correctedThisMonth = today.date(Math.min(targetDay, today.daysInMonth()))
    const correctedNextMonth = nextMonth.date(Math.min(targetDay, nextMonth.daysInMonth()))

    const isPastTargetDay = today.date() > targetDay

    const startDate = isPastTargetDay ? correctedThisMonth : correctedPrevMonth

    const endDate = isPastTargetDay ? correctedNextMonth : correctedThisMonth

    return `${startDate.format('D MMMM')} – ${endDate.format('D MMMM')}`
}
