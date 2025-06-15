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
import { TFunction } from 'i18next'

const getProcessIcon = (processName: string) => {
    if (processName.includes('REST API')) return PiCloudDuotone
    if (processName.includes('Scheduler')) return PiClockDuotone
    if (processName.includes('Jobs')) return PiQueueDuotone
    return PiGearSixDuotone
}

const getCpuColor = (cpuUsage: number) => {
    if (cpuUsage < 30) return 'var(--mantine-color-green-4)'
    if (cpuUsage < 70) return 'var(--mantine-color-yellow-4)'
    return 'var(--mantine-color-red-4)'
}

export const getPm2SummaryMetrics = (
    pm2Stats: GetRemnawaveHealthCommand.Response['response']['pm2Stats'],
    t: TFunction
) => {
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
            icon: PiGearSixDuotone,
            title: t('pm2-metrics.total-processes'),
            color: 'var(--mantine-color-blue-4)'
        },
        {
            value: `${totalMemoryMB.toFixed(0)} MiB`,
            icon: PiMemoryDuotone,
            title: t('pm2-metrics.total-memory'),
            color: 'var(--mantine-color-cyan-4)'
        },
        {
            value: `${averageCpu.toFixed(1)}%`,
            icon: PiCpuDuotone,
            title: t('pm2-metrics.average-cpu'),
            color: 'var(--mantine-color-green-4)'
        },
        {
            value: `${heaviestProcess.name}`,
            icon: PiRocketLaunchDuotone,
            title: t('pm2-metrics.heaviest-process'),
            color: 'var(--mantine-color-orange-4)'
        }
    ]
}

export const getPm2ProcessMetrics = (
    pm2Stats: GetRemnawaveHealthCommand.Response['response']['pm2Stats']
) => {
    if (!pm2Stats || pm2Stats.length === 0) {
        return []
    }

    return pm2Stats.map((process) => {
        const cpuUsage = parseFloat(process.cpu)
        return {
            value: `${process.cpu}% / ${process.memory}`,
            icon: getProcessIcon(process.name),
            title: process.name,
            color: getCpuColor(cpuUsage)
        }
    })
}

export const getPm2Metrics = getPm2SummaryMetrics
