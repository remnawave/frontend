import { Box, SimpleGrid, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { MetricWithIcon } from '@widgets/dashboard/home/metric-with-icons'
import { MetricWithTrend } from '@shared/ui/metrics'
import { LoadingScreen } from '@shared/ui'
import { Page } from '@shared/ui/page'

import {
    getBandwidthMetrics,
    getOnlineMetrics,
    getPm2ProcessMetrics,
    getPm2SummaryMetrics,
    getSimpleMetrics,
    getUsersMetrics
} from './metrics'
import classes from './home.module.css'
import { IProps } from './interfaces'

interface IAnimatedCardProps {
    children: React.ReactNode
    index: number
}

const AnimatedCard = ({ children, index }: IAnimatedCardProps) => (
    <Box className={classes.card} style={{ '--card-index': index } as React.CSSProperties}>
        {children}
    </Box>
)

export const HomePage = (props: IProps) => {
    const { t } = useTranslation()

    const { systemInfo, bandwidthStats, remnawaveHealth } = props

    if (!systemInfo || !bandwidthStats || !remnawaveHealth) {
        return <LoadingScreen />
    }

    const bandwidthMetrics = getBandwidthMetrics(bandwidthStats, t)
    const simpleMetrics = getSimpleMetrics(systemInfo, t)
    const usersMetrics = getUsersMetrics(systemInfo.users, t)
    const onlineMetrics = getOnlineMetrics(systemInfo.onlineStats, t)
    const pm2SummaryMetrics = getPm2SummaryMetrics(remnawaveHealth.pm2Stats, t)
    const pm2ProcessMetrics = getPm2ProcessMetrics(remnawaveHealth.pm2Stats)

    return (
        <Page title={t('constants.home')}>
            <Stack gap="sm">
                {pm2SummaryMetrics.length > 0 && (
                    <div className={classes.section}>
                        <Title className={classes.title} m="xs" ml={0} order={4}>
                            {t('home.page.remnawave-usage')}
                        </Title>

                        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                            {pm2SummaryMetrics.map((metric, index) => (
                                <AnimatedCard index={index} key={metric.title}>
                                    <MetricWithIcon {...metric} />
                                </AnimatedCard>
                            ))}
                        </SimpleGrid>
                    </div>
                )}

                {pm2ProcessMetrics.length > 0 && (
                    <div className={classes.section}>
                        <Title className={classes.title} m="xs" ml={0} order={4}>
                            {t('home.page.process-details')}
                        </Title>
                        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                            {pm2ProcessMetrics.map((metric, index) => (
                                <AnimatedCard index={index} key={metric.title}>
                                    <MetricWithIcon {...metric} />
                                </AnimatedCard>
                            ))}
                        </SimpleGrid>
                    </div>
                )}

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.bandwidth')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                        {bandwidthMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricWithTrend {...metric} />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.online-stats')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                        {onlineMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricWithIcon {...metric} />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.system')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                        {simpleMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricWithIcon {...metric} />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('user-table.widget.table-title')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
                        {usersMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricWithIcon {...metric} />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>
            </Stack>
        </Page>
    )
}
