import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'
import { formatInt } from '@shared/utils/misc'

export const getUsersMetrics = (
    users: GetStatsCommand.Response['response']['users'],
    t: TFunction
): IMetricCardProps[] => {
    return [
        {
            value: formatInt(users.totalUsers) ?? 0,
            IconComponent: PiUsersDuotone,
            title: t('users-metrics.widget.total'),
            iconVariant: 'gradient-blue'
        },
        {
            value: formatInt(users.statusCounts.ACTIVE) ?? 0,
            title: 'Active',
            IconComponent: PiPulseDuotone,
            iconVariant: 'gradient-teal'
        },
        {
            value: formatInt(users.statusCounts.EXPIRED) ?? 0,
            IconComponent: PiClockUserDuotone,
            title: 'Expired',
            iconVariant: 'gradient-red'
        },
        {
            value: formatInt(users.statusCounts.LIMITED) ?? 0,
            IconComponent: PiClockCountdownDuotone,
            title: 'Limited',
            iconVariant: 'gradient-orange'
        },
        {
            value: formatInt(users.statusCounts.DISABLED) ?? 0,
            IconComponent: PiProhibitDuotone,
            title: 'Disabled',
            iconVariant: 'gradient-gray'
        }
    ]
}
