import { PiChartBarDuotone, PiCpuDuotone, PiMemoryFill, PiMemoryLight } from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { prettyBytesUtil, prettyBytesUtilWithoutPrefix } from '@shared/utils/bytes'
import { IMetricCardProps } from '@shared/ui/metrics/metric-card'

export const getSimpleMetrics = (
    systemInfo: GetStatsCommand.Response['response'],
    t: TFunction
): IMetricCardProps[] => {
    const { memory, nodes } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    return [
        {
            value: nodes.totalOnline,
            IconComponent: PiCpuDuotone,
            title: t('simple-metrics.total-online-on-nodes'),
            iconVariant: 'gradient-blue'
        },
        {
            value: prettyBytesUtilWithoutPrefix(Number(nodes.totalBytesLifetime)) ?? 0,
            IconComponent: PiChartBarDuotone,
            title: t('simple-metrics.total-traffic'),
            iconVariant: 'gradient-green'
        },
        {
            value: usedRamGB,
            IconComponent: PiMemoryLight,
            title: t('simple-metrics.ram-usage'),
            iconVariant: 'gradient-cyan'
        },
        {
            value: totalRamGB,
            IconComponent: PiMemoryFill,
            title: 'Total RAM',
            iconVariant: 'gradient-cyan'
        }
    ]
}
