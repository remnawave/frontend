import { PiChartBarDuotone, PiClockDuotone, PiMemoryDuotone } from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'

import { prettyBytesUtil } from '@shared/utils/bytes'

export const getSimpleMetrics = (systemInfo: GetStatsCommand.Response['response']) => {
    const { memory, users } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    return [
        {
            value: prettyBytesUtil(Number(users.totalTrafficBytes)) ?? 0,
            icon: PiChartBarDuotone,
            title: 'Total traffic',
            color: 'green'
        },
        {
            value: `${usedRamGB} / ${totalRamGB}`,
            icon: PiMemoryDuotone,
            title: 'RAM usage',
            color: 'cyan'
        },
        {
            value: dayjs.duration(systemInfo.uptime, 'seconds').humanize(false),
            title: 'System uptime',
            icon: PiClockDuotone,
            color: 'gray'
        }
    ]
}
