import { PiChartBarDuotone, PiClockDuotone, PiCpuDuotone, PiMemoryDuotone } from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { i18n, TFunction } from 'i18next'
import dayjs from 'dayjs'

import { prettyBytesUtil, prettyBytesUtilWithoutPrefix } from '@shared/utils/bytes'

export const getSimpleMetrics = (
    systemInfo: GetStatsCommand.Response['response'],
    t: TFunction,
    i18n: i18n
) => {
    const { memory, users, nodes } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    return [
        {
            value: nodes.totalOnline,
            icon: PiCpuDuotone,
            title: t('simple-metrics.total-online-on-nodes'),
            color: 'var(--mantine-color-blue-4)'
        },
        {
            value: prettyBytesUtilWithoutPrefix(Number(users.totalTrafficBytes)) ?? 0,
            icon: PiChartBarDuotone,
            title: t('simple-metrics.total-traffic'),
            color: 'var(--mantine-color-green-4)'
        },
        {
            value: `${usedRamGB} / ${totalRamGB}`,
            icon: PiMemoryDuotone,
            title: t('simple-metrics.ram-usage'),
            color: 'var(--mantine-color-cyan-4)'
        },
        {
            value: dayjs
                .duration(systemInfo.uptime, 'seconds')
                .locale(i18n.language)
                .humanize(false),
            title: t('simple-metrics.system-uptime'),
            icon: PiClockDuotone,
            color: 'var(--mantine-color-gray-4)'
        }
    ]
}
