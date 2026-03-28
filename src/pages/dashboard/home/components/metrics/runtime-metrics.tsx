import {
    PiClockDuotone,
    PiCloudDuotone,
    PiGearSixDuotone,
    PiMemoryDuotone,
    PiQueueDuotone,
    PiTimerDuotone,
    PiTreeStructureDuotone
} from 'react-icons/pi'
import { GetRemnawaveHealthCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

const PROCESS_CONFIG: Record<string, { Icon: typeof PiGearSixDuotone; name: string }> = {
    api: { Icon: PiCloudDuotone, name: 'API' },
    scheduler: { Icon: PiClockDuotone, name: 'Scheduler' },
    processor: { Icon: PiQueueDuotone, name: 'Processor' }
}

const DEFAULT_PROCESS = { Icon: PiGearSixDuotone, name: 'Unknown' }

export const getRuntimeSummaryMetrics = (
    runtimeMetrics: GetRemnawaveHealthCommand.Response['response']['runtimeMetrics'],
    t: TFunction
): IMetricCardProps[] => {
    if (!runtimeMetrics || runtimeMetrics.length === 0) {
        return []
    }

    const totalRss = runtimeMetrics.reduce((sum, p) => sum + Number(p.rss), 0)
    const totalHeapUsed = runtimeMetrics.reduce((sum, p) => sum + Number(p.heapUsed), 0)
    const avgEventLoopDelay =
        runtimeMetrics.reduce((sum, p) => sum + Number(p.eventLoopDelayMs), 0) /
        runtimeMetrics.length

    return [
        {
            value: runtimeMetrics.length,
            IconComponent: PiGearSixDuotone,
            title: t('pm2-metrics.total-processes'),
            iconVariant: 'soft',
            iconColor: 'blue'
        },
        {
            value: prettyBytesToAnyUtil(totalRss, true),
            IconComponent: PiMemoryDuotone,
            title: t('pm2-metrics.total-memory'),
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            value: prettyBytesToAnyUtil(totalHeapUsed, true),
            IconComponent: PiTreeStructureDuotone,
            title: 'Heap Used',
            iconVariant: 'soft',
            iconColor: 'green'
        },
        {
            value: `${avgEventLoopDelay.toFixed(2)} ms`,
            IconComponent: PiTimerDuotone,
            title: 'Avg Event Loop',
            iconVariant: 'soft',
            iconColor: 'orange'
        }
    ]
}

export const getRuntimeProcessMetrics = (
    runtimeMetrics: GetRemnawaveHealthCommand.Response['response']['runtimeMetrics']
): IMetricCardProps[] => {
    if (!runtimeMetrics || runtimeMetrics.length === 0) {
        return []
    }

    return runtimeMetrics.map((process) => {
        const config = PROCESS_CONFIG[process.instanceType] ?? DEFAULT_PROCESS
        return {
            value: prettyBytesToAnyUtil(process.rss, true),
            IconComponent: config.Icon,
            title: `${config.name}-${process.instanceId}`,
            iconVariant: 'soft',
            iconColor: 'teal'
        }
    })
}

export const getRuntimeMetrics = getRuntimeSummaryMetrics
