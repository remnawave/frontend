import { SimpleGrid, Stack, Text } from '@mantine/core'

import { MetricWithIcon } from '@widgets/dashboard/home/metric-with-icons'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { MetricWithTrend } from '@shared/ui/metrics'
import { Page } from '@shared/ui/page'

import { getBandwidthMetrics, getOnlineMetrics, getSimpleMetrics, getUsersMetrics } from './metrics'
import { BREADCRUMBS } from './constant'
import { IProps } from './interfaces'

export const HomePage = (props: IProps) => {
    const { systemInfo, bandwidthStats } = props

    if (!systemInfo || !bandwidthStats) {
        return <LoadingScreen />
    }

    const bandwidthMetrics = getBandwidthMetrics(bandwidthStats)
    const simpleMetrics = getSimpleMetrics(systemInfo)
    const usersMetrics = getUsersMetrics(systemInfo.users)
    const onlineMetrics = getOnlineMetrics(systemInfo.onlineStats)

    return (
        <Page title="Home">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Short stats" />

            <Stack gap="sm" mb="xl">
                <Text fw={600}>Bandwidth</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {bandwidthMetrics.map((metric) => (
                        <MetricWithTrend key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>System</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {simpleMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>Online stats</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                    {onlineMetrics.map((metric) => (
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
