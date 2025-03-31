import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { formatInt } from '@shared/utils/misc'

export const getUsersMetrics = (
    users: GetStatsCommand.Response['response']['users'],
    t: TFunction
) => {
    return [
        {
            value: formatInt(users.totalUsers) ?? 0,
            icon: PiUsersDuotone,
            title: t('users-metrics.total-users'),
            color: 'var(--mantine-color-blue-4)'
        },
        {
            value: formatInt(users.statusCounts.ACTIVE) ?? 0,
            title: t('users-metrics.active-users'),
            icon: PiPulseDuotone,
            color: 'var(--mantine-color-teal-4)'
        },
        {
            value: formatInt(users.statusCounts.EXPIRED) ?? 0,
            icon: PiClockUserDuotone,
            title: t('users-metrics.expired-users'),
            color: 'var(--mantine-color-red-4)'
        },
        {
            value: formatInt(users.statusCounts.LIMITED) ?? 0,
            icon: PiClockCountdownDuotone,
            title: t('users-metrics.limited-users'),
            color: 'var(--mantine-color-orange-4)'
        },
        {
            value: formatInt(users.statusCounts.DISABLED) ?? 0,
            icon: PiProhibitDuotone,
            title: t('users-metrics.disabled-users'),
            color: 'var(--mantine-color-gray-4)'
        }
    ]
}
