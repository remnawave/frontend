import {
    PiClockCountdownDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'
import { formatInt } from '@shared/utils/misc'

export const getOnlineMetrics = (
    onlineStats: GetStatsCommand.Response['response']['onlineStats'],
    t: TFunction
): IMetricCardProps[] => {
    return [
        {
            value: formatInt(onlineStats.onlineNow) ?? 0,
            IconComponent: PiPulseDuotone,
            title: t('online-metrics.online-now'),
            iconVariant: 'gradient-teal'
        },
        {
            value: formatInt(onlineStats.lastDay) ?? 0,
            IconComponent: PiClockCountdownDuotone,
            title: t('online-metrics.online-today'),
            iconVariant: 'gradient-blue'
        },
        {
            value: formatInt(onlineStats.lastWeek) ?? 0,
            IconComponent: PiUsersDuotone,
            title: t('online-metrics.online-this-week'),
            iconVariant: 'gradient-indigo'
        },
        {
            value: formatInt(onlineStats.neverOnline) ?? 0,
            IconComponent: PiProhibitDuotone,
            title: t('online-metrics.never-online'),
            iconVariant: 'gradient-red'
        }
    ]
}
