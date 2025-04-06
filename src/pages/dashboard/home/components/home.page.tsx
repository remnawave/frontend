import { SimpleGrid, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { MetricWithIcon } from '@widgets/dashboard/home/metric-with-icons'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { MetricWithTrend } from '@shared/ui/metrics'
import { Page } from '@shared/ui/page'

import { getBandwidthMetrics, getOnlineMetrics, getSimpleMetrics, getUsersMetrics } from './metrics'
import { IProps } from './interfaces'

export const HomePage = (props: IProps) => {
    const { t } = useTranslation()

    const { systemInfo, bandwidthStats } = props

    if (!systemInfo || !bandwidthStats) {
        return <LoadingScreen />
    }

    const bandwidthMetrics = getBandwidthMetrics(bandwidthStats, t)
    const simpleMetrics = getSimpleMetrics(systemInfo, t)
    const usersMetrics = getUsersMetrics(systemInfo.users, t)
    const onlineMetrics = getOnlineMetrics(systemInfo.onlineStats, t)

    return (
        <Page title={t('constants.home')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: '/' },
                    { label: t('constants.overview'), href: '/' },
                    { label: t('constants.home') }
                ]}
                title={t('home.page.short-stats')}
            />

            <Stack gap="sm" mb="xl">
                <Text fw={600}>{t('home.page.bandwidth')}</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {bandwidthMetrics.map((metric) => (
                        <MetricWithTrend key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>{t('home.page.system')}</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {simpleMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>{t('home.page.online-stats')}</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                    {onlineMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>

                <Text fw={600}>{t('user-table.widget.table-title')}</Text>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                    {usersMetrics.map((metric) => (
                        <MetricWithIcon key={metric.title} {...metric} />
                    ))}
                </SimpleGrid>
            </Stack>
        </Page>
    )
}
