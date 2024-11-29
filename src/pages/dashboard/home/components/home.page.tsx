import { Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Page } from '@shared/ui/page'
import dayjs from 'dayjs'
import {
    PiChartBarDuotone,
    PiChartDonutDuotone,
    PiClockCountdownDuotone,
    PiClockDuotone,
    PiClockUserDuotone,
    PiCpuDuotone,
    PiDevicesDuotone,
    PiMemoryDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { LoadingScreen, PageHeader } from '@/shared/ui'
import { MetricWithTrend } from '@/shared/ui/metrics'
import { formatInt } from '@/shared/utils'
import { prettyBytesUtil } from '@/shared/utils/bytes'
import { MetricWithIcon } from '@/widgets/dashboard/home/metric-with-icons'
import { BREADCRUMBS } from './constant'
import { IProps } from './interfaces'

export const HomePage = (props: IProps) => {
    const { systemInfo } = props

    if (!systemInfo) {
        return <LoadingScreen />
    }

    const { users, memory, stats } = systemInfo

    const totalRamGB = prettyBytesUtil(memory.total) ?? 0
    const usedRamGB = prettyBytesUtil(memory.active) ?? 0

    const simpleMetrics = [
        {
            icon: PiChartBarDuotone,
            title: 'Total traffic',
            value: prettyBytesUtil(Number(users.totalTrafficBytes)) ?? 0,
            color: 'green'
        },
        {
            icon: PiMemoryDuotone,
            title: 'RAM usage',
            value: `${usedRamGB} / ${totalRamGB}`,
            color: 'cyan'
        },
        {
            icon: PiClockDuotone,
            title: 'System uptime',
            value: dayjs.duration(systemInfo.uptime, 'seconds').humanize(false),
            color: 'gray'
        }
    ]

    const usersMetrics = [
        {
            icon: PiDevicesDuotone,
            title: 'Online users',
            value: formatInt(users.onlineLastMinute) ?? 0,
            color: 'teal'
        },
        {
            icon: PiUsersDuotone,
            title: 'Total users',
            value: formatInt(users.totalUsers) ?? 0,
            color: 'blue'
        },
        {
            icon: PiPulseDuotone,
            title: 'Active users',
            value: formatInt(users.statusCounts.ACTIVE) ?? 0,
            color: 'teal'
        },
        {
            icon: PiClockUserDuotone,
            title: 'Expired users',
            value: formatInt(users.statusCounts.EXPIRED) ?? 0,
            color: 'red'
        },
        {
            icon: PiClockCountdownDuotone,
            title: 'Limited users',
            value: formatInt(users.statusCounts.LIMITED) ?? 0,
            color: 'orange'
        },
        {
            icon: PiProhibitDuotone,
            title: 'Disabled users',
            value: formatInt(users.statusCounts.DISABLED) ?? 0,
            color: 'gray'
        }
    ]

    return (
        <Page title="Home">
            <PageHeader title="Short stats" breadcrumbs={BREADCRUMBS} />

            <Stack gap="sm" mb="xl">
                <Text fw={600}>Bandwidth</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    <MetricWithTrend
                        title="Today's nodes usage"
                        value={stats.nodesUsageLastTwoDays.current}
                        color="var(--mantine-color-blue-6)"
                        percentage={stats.nodesUsageLastTwoDays.percentage}
                        period="from yesterday"
                        icon={
                            <PiChartDonutDuotone size="2rem" color="var(--mantine-color-blue-6)" />
                        }
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
