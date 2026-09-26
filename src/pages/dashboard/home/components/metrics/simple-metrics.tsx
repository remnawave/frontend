import { GetStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'
import { PiChartBarDuotone, PiCpuDuotone, PiMemoryFill, PiMemoryLight } from 'react-icons/pi'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'
import { prettifyBytesUtil } from '@shared/utils/bytes'

export const getSimpleMetrics = (
    systemInfo: GetStatsCommand.Response['response'],
    t: TFunction
): IMetricCardProps[] => {
    const { memory, nodes } = systemInfo

    const totalRamGB = prettifyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettifyBytesUtil(memory.used) ?? 0

    return [
        {
            value: nodes.totalOnline,
            IconComponent: PiCpuDuotone,
            title: t('simple-metrics.total-online-on-nodes'),
            iconVariant: 'soft',
            iconColor: 'blue'
        },
        {
            value: prettifyBytesUtil(Number(nodes.totalBytesLifetime)) ?? 0,
            IconComponent: PiChartBarDuotone,
            title: t('common.field.total-traffic'),
            iconVariant: 'soft',
            iconColor: 'green'
        },
        {
            value: usedRamGB,
            IconComponent: PiMemoryLight,
            title: t('simple-metrics.ram-usage'),
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            value: totalRamGB,
            IconComponent: PiMemoryFill,
            title: 'Total RAM',
            iconVariant: 'soft',
            iconColor: 'cyan'
        }
    ]
}
