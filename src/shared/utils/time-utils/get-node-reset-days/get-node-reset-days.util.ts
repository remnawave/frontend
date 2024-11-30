import dayjs from 'dayjs'

export function getNodeResetDaysUtil(targetDay: number): string {
    const today = dayjs()

    const targetThisMonth = today.date(targetDay)
    const targetNextMonth = today.add(1, 'month').date(targetDay)

    const correctedThisMonth = targetThisMonth.isValid() ? targetThisMonth : today.endOf('month')

    const correctedNextMonth = targetNextMonth.isValid()
        ? targetNextMonth
        : today.add(1, 'month').endOf('month')

    const daysToThisMonth = correctedThisMonth.diff(today, 'day')
    const daysToNextMonth = correctedNextMonth.diff(today, 'day')

    const targetDate =
        daysToThisMonth < 0
            ? correctedNextMonth
            : daysToThisMonth < daysToNextMonth
              ? correctedThisMonth
              : correctedNextMonth

    if (targetDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
        return 'Today'
    }

    return targetDate.fromNow()
}