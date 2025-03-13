import { PiChartBarDuotone, PiClockDuotone, PiMemoryDuotone } from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'
import dayjs from 'dayjs'

import { prettyBytesUtil, prettyBytesUtilWithoutPrefix } from '@shared/utils/bytes'

export const getSimpleMetrics = (
    systemInfo: GetStatsCommand.Response['response'],
    t: TFunction
) => {
    const { memory, users } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    return [
        {
            value: prettyBytesUtilWithoutPrefix(Number(users.totalTrafficBytes)) ?? 0,
            icon: PiChartBarDuotone,
            title: t('simple-metrics.total-traffic'),
            color: 'green'
        },
        {
            value: `${usedRamGB} / ${totalRamGB}`,
            icon: PiMemoryDuotone,
            title: t('simple-metrics.ram-usage'),
            color: 'cyan'
        },
        {
            value: dayjs.duration(systemInfo.uptime, 'seconds').humanize(false),
            title: t('simple-metrics.system-uptime'),
            icon: PiClockDuotone,
            color: 'gray'
        }
    ]
}
