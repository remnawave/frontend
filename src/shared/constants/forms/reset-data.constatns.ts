import { RESET_PERIODS } from '@remnawave/backend-contract'

export const resetDataStrategy = [
    { value: RESET_PERIODS.NO_RESET, label: 'Never reset' },
    { value: RESET_PERIODS.DAY, label: 'Reset daily' },
    { value: RESET_PERIODS.WEEK, label: 'Reset weekly' },
    { value: RESET_PERIODS.MONTH, label: 'Reset monthly' },
    { value: RESET_PERIODS.YEAR, label: 'Reset yearly' }
]
