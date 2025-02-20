import { RESET_PERIODS } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

export const resetDataStrategy = (t: TFunction) => [
    { value: RESET_PERIODS.NO_RESET, label: t('reset-data.constants.never-reset') },
    { value: RESET_PERIODS.DAY, label: t('reset-data.constants.reset-daily') },
    { value: RESET_PERIODS.WEEK, label: t('reset-data.constants.reset-weekly') },
    { value: RESET_PERIODS.MONTH, label: t('reset-data.constants.reset-monthly') }
]
