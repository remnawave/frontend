import {
    PiClockCountdownDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { formatInt } from '@shared/utils/misc'

export const getOnlineMetrics = (
    onlineStats: GetStatsCommand.Response['response']['onlineStats'],
    t: TFunction
) => {
    return [
        {
            value: formatInt(onlineStats.onlineNow) ?? 0,
            icon: PiPulseDuotone,
            title: t('online-metrics.online-now'),
            color: 'var(--mantine-color-teal-4)'
        },
        {
            value: formatInt(onlineStats.lastDay) ?? 0,
            icon: PiClockCountdownDuotone,
            title: t('online-metrics.online-today'),
            color: 'var(--mantine-color-blue-4)'
        },
        {
            value: formatInt(onlineStats.lastWeek) ?? 0,
            icon: PiUsersDuotone,
            title: t('online-metrics.online-this-week'),
            color: 'var(--mantine-color-indigo-4)'
        },
        {
            value: formatInt(onlineStats.neverOnline) ?? 0,
            icon: PiProhibitDuotone,
            title: t('online-metrics.never-online'),
            color: 'var(--mantine-color-red-4)'
        }
    ]
}
