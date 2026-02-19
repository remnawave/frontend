import {
    PiClockDuotone,
    PiCloudDuotone,
    PiCpuDuotone,
    PiGearSixDuotone,
    PiMemoryDuotone,
    PiQueueDuotone,
    PiRocketLaunchDuotone
} from 'react-icons/pi'
import { GetRemnawaveHealthCommand } from '@remnawave/backend-contract'
import { ThemeIconProps } from '@mantine/core'
import { TFunction } from 'i18next'

import { IMetricCardProps } from '@shared/ui/metrics/metric-card'

const getProcessIcon = (processName: string) => {
    if (processName.includes('REST API')) return PiCloudDuotone
    if (processName.includes('Scheduler')) return PiClockDuotone
    if (processName.includes('Jobs')) return PiQueueDuotone
    return PiGearSixDuotone
}

const getIconVariant = (cpuUsage: number): ThemeIconProps['variant'] => {
    if (cpuUsage < 30) return 'gradient-green'
    if (cpuUsage < 70) return 'gradient-yellow'
    return 'gradient-red'
}

export const getPm2SummaryMetrics = (
    pm2Stats: GetRemnawaveHealthCommand.Response['response']['pm2Stats'],
    t: TFunction
): IMetricCardProps[] => {
    if (!pm2Stats || pm2Stats.length === 0) {
        return []
    }

    const totalMemoryMB = pm2Stats.reduce((sum, process) => {
        const memoryValue = parseFloat(process.memory.replace(' MiB', ''))
        return sum + memoryValue
    }, 0)

    const averageCpu =
        pm2Stats.reduce((sum, process) => {
            return sum + parseFloat(process.cpu)
        }, 0) / pm2Stats.length

    const heaviestProcess = pm2Stats.reduce((max, process) => {
        return parseFloat(process.cpu) > parseFloat(max.cpu) ? process : max
    })

    return [
        {
            value: pm2Stats.length,
            IconComponent: PiGearSixDuotone,
            title: t('pm2-metrics.total-processes'),
            iconVariant: 'gradient-blue'
        },
        {
            value: `${totalMemoryMB.toFixed(0)} MiB`,
            IconComponent: PiMemoryDuotone,
            title: t('pm2-metrics.total-memory'),
            iconVariant: 'gradient-cyan'
        },
        {
            value: `${averageCpu.toFixed(1)}%`,
            IconComponent: PiCpuDuotone,
            title: t('pm2-metrics.average-cpu'),
            iconVariant: 'gradient-green'
        },
        {
            value: `${heaviestProcess.name}`,
            IconComponent: PiRocketLaunchDuotone,
            title: t('pm2-metrics.heaviest-process'),
            iconVariant: 'gradient-orange'
        }
    ]
}

export const getPm2ProcessMetrics = (
    pm2Stats: GetRemnawaveHealthCommand.Response['response']['pm2Stats']
): IMetricCardProps[] => {
    if (!pm2Stats || pm2Stats.length === 0) {
        return []
    }

    return pm2Stats.map((process) => {
        const cpuUsage = parseFloat(process.cpu)
        return {
            value: `${process.memory}`,
            IconComponent: getProcessIcon(process.name),
            title: process.name,
            iconVariant: getIconVariant(cpuUsage)
        }
    })
}

export const getPm2Metrics = getPm2SummaryMetrics
