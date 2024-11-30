import {
    PiClockCountdownDuotone,
    PiChartDonutDuotone,
    PiClockUserDuotone,
    PiChartBarDuotone,
    PiProhibitDuotone,
    PiDevicesDuotone,
    PiMemoryDuotone,
    PiClockDuotone,
    PiPulseDuotone,
    PiUsersDuotone,
    PiCpuDuotone
} from 'react-icons/pi'
import { MetricWithIcon } from '@/widgets/dashboard/home/metric-with-icons'
import { SimpleGrid, JsonInput, Group, Stack, Text } from '@mantine/core'
import { LoadingScreen, PageHeader } from '@/shared/ui'
import { prettyBytesUtil } from '@/shared/utils/bytes'
import { MetricWithTrend } from '@/shared/ui/metrics'
import { formatInt } from '@/shared/utils'
import { Page } from '@shared/ui/page'
import dayjs from 'dayjs'

import { BREADCRUMBS } from './constant'
import { IProps } from './interfaces'

export const HomePage = (props: IProps) => {
    const { systemInfo } = props

    if (!systemInfo) {
        return <LoadingScreen />
    }

    const { memory, stats, users } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    const simpleMetrics = [
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

    const usersMetrics = [
        {
            value: formatInt(users.onlineLastMinute) ?? 0,
            icon: PiDevicesDuotone,
            title: 'Online users',
            color: 'teal'
        },
        {
            value: formatInt(users.totalUsers) ?? 0,
            icon: PiUsersDuotone,
            title: 'Total users',
            color: 'blue'
        },
        {
            value: formatInt(users.statusCounts.ACTIVE) ?? 0,
            title: 'Active users',
            icon: PiPulseDuotone,
            color: 'teal'
        },
        {
            value: formatInt(users.statusCounts.EXPIRED) ?? 0,
            icon: PiClockUserDuotone,
            title: 'Expired users',
            color: 'red'
        },
        {
            value: formatInt(users.statusCounts.LIMITED) ?? 0,
            icon: PiClockCountdownDuotone,
            title: 'Limited users',
            color: 'orange'
        },
        {
            value: formatInt(users.statusCounts.DISABLED) ?? 0,
            icon: PiProhibitDuotone,
            title: 'Disabled users',
            color: 'gray'
        }
    ]

    return (
        <Page title="Home">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Short stats" />

            <Stack gap="sm" mb="xl">
                <Text fw={600}>Bandwidth</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    <MetricWithTrend
                        icon={
                            <PiChartDonutDuotone color="var(--mantine-color-blue-6)" size="2rem" />
                        }
                        percentage={stats.nodesUsageLastTwoDays.percentage}
                        value={stats.nodesUsageLastTwoDays.current}
                        color="var(--mantine-color-blue-6)"
                        title="Today's nodes usage"
                        period="from yesterday"
                    />
                </SimpleGrid>

                <Text fw={600}>System</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {simpleMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>Users</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                    {usersMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>
            </Stack>
        </Page>
    )
}
