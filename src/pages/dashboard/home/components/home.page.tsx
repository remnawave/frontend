import { ActionIcon, Box, Group, SimpleGrid, Stack, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCamera, TbInfoCircle } from 'react-icons/tb'

import { useIsMobile } from '@shared/hooks'
import { LoadingScreen } from '@shared/ui'
import { DisclaimerOverlay } from '@shared/ui/disclaimer-overlay'
import { MetricCardShared, MetricCardWithTrendShared } from '@shared/ui/metrics/metric-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { Page } from '@shared/ui/page'
import { copyScreenshotToClipboard } from '@shared/utils/copy-screenshot.util'

import classes from './home.module.css'
import { IProps } from './interfaces'
import {
    getBandwidthMetrics,
    getOnlineMetrics,
    getRuntimeProcessMetrics,
    getRuntimeSummaryMetrics,
    getSimpleMetrics,
    getUsersMetrics
} from './metrics'
import { RuntimeDetailCard } from './runtime-detail-card'
import { RuntimeInfoModalContent } from './runtime-info-modal/runtime-info-modal'

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

    const isMobile = useIsMobile()
    const runtimeRef = useRef<HTMLDivElement>(null)
    const [copying, setCopying] = useState(false)

    const { systemInfo, bandwidthStats, remnawaveHealth } = props

    const copyRuntimeScreenshot = async () => {
        if (!runtimeRef.current || copying) return
        setCopying(true)
        try {
            await copyScreenshotToClipboard(async () => {
                await new Promise<void>((resolve) => {
                    setTimeout(resolve, 100)
                })
                if (!runtimeRef.current) throw new Error('runtimeRef')
                return runtimeRef.current
            }, 'remnawave-runtime.png')
        } catch (error) {
            notifications.show({
                color: 'red',
                message: `${error instanceof Error ? error.message : 'Unknown error'}`,
                title: 'Error'
            })
        } finally {
            setCopying(false)
        }
    }

    if (!systemInfo || !bandwidthStats || !remnawaveHealth) {
        return <LoadingScreen />
    }

    const bandwidthMetrics = getBandwidthMetrics(bandwidthStats, t)
    const simpleMetrics = getSimpleMetrics(systemInfo, t)
    const usersMetrics = getUsersMetrics(systemInfo.users, t)
    const onlineMetrics = getOnlineMetrics(systemInfo.onlineStats, t)
    const runtimeSummaryMetrics = getRuntimeSummaryMetrics(remnawaveHealth.runtimeMetrics, t)
    const runtimeProcessMetrics = getRuntimeProcessMetrics(remnawaveHealth.runtimeMetrics)

    return (
        <Page title={t('constants.home')}>
            <Stack gap="sm">
                {runtimeSummaryMetrics.length > 0 && (
                    <div className={classes.section}>
                        <Title className={classes.title} m="xs" ml={0} order={4}>
                            {t('home.page.remnawave-usage')}
                        </Title>

                        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="xs">
                            {runtimeSummaryMetrics.map((metric, index) => (
                                <AnimatedCard index={index} key={metric.title}>
                                    <MetricCardShared {...metric} />
                                </AnimatedCard>
                            ))}
                        </SimpleGrid>
                    </div>
                )}

                {runtimeProcessMetrics.length > 0 && (
                    <div className={classes.section}>
                        <Title className={classes.title} m="xs" ml={0} order={4}>
                            {t('home.page.process-details')}
                        </Title>
                        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="xs">
                            {runtimeProcessMetrics.map((metric, index) => (
                                <AnimatedCard index={index} key={metric.title}>
                                    <MetricCardShared {...metric} />
                                </AnimatedCard>
                            ))}
                        </SimpleGrid>
                    </div>
                )}

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.bandwidth')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="xs">
                        {bandwidthMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricCardWithTrendShared {...metric} />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.online-stats')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="xs">
                        {onlineMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricCardShared
                                    iconColor={metric.iconColor}
                                    IconComponent={metric.IconComponent}
                                    iconVariant={metric.iconVariant}
                                    isLoading={false}
                                    title={metric.title}
                                    value={metric.value}
                                />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('home.page.system')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="xs">
                        {simpleMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricCardShared
                                    iconColor={metric.iconColor}
                                    IconComponent={metric.IconComponent}
                                    iconVariant={metric.iconVariant}
                                    isLoading={false}
                                    title={metric.title}
                                    value={metric.value}
                                />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                <div className={classes.section}>
                    <Title className={classes.title} m="xs" ml={0} order={4}>
                        {t('user-table.widget.table-title')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }} spacing="xs">
                        {usersMetrics.map((metric, index) => (
                            <AnimatedCard index={index} key={metric.title}>
                                <MetricCardShared
                                    iconColor={metric.iconColor}
                                    IconComponent={metric.IconComponent}
                                    iconVariant={metric.iconVariant}
                                    isLoading={false}
                                    title={metric.title}
                                    value={metric.value}
                                />
                            </AnimatedCard>
                        ))}
                    </SimpleGrid>
                </div>

                {remnawaveHealth.runtimeMetrics && remnawaveHealth.runtimeMetrics.length > 0 && (
                    <div className={classes.section}>
                        <Group align="center" gap="xs" m="xs" ml={0}>
                            <Title className={classes.title} order={4}>
                                Runtime
                            </Title>

                            <ActionIcon
                                color="gray"
                                loading={copying}
                                onClick={() => copyRuntimeScreenshot()}
                                radius="md"
                                size="sm"
                                variant="transparent"
                            >
                                <TbCamera size={24} />
                            </ActionIcon>

                            <ActionIcon
                                color="gray"
                                onClick={() => {
                                    modals.open({
                                        title: (
                                            <BaseOverlayHeader
                                                iconColor="cyan"
                                                IconComponent={TbInfoCircle}
                                                iconSize={20}
                                                iconVariant="soft"
                                                subtitle={t('home.runtime-info.subtitle')}
                                                title={t('home.runtime-info.title')}
                                            />
                                        ),
                                        size: 'xl',
                                        centered: true,
                                        fullScreen: isMobile,
                                        children: <RuntimeInfoModalContent />
                                    })
                                }}
                                radius="md"
                                size="sm"
                                variant="transparent"
                            >
                                <TbInfoCircle size={24} />
                            </ActionIcon>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 1, xl: 2 }} ref={runtimeRef} spacing="xs">
                            {remnawaveHealth.runtimeMetrics.map((metric, index) => (
                                <AnimatedCard index={index} key={metric.pid}>
                                    <RuntimeDetailCard metric={metric} />
                                </AnimatedCard>
                            ))}
                        </SimpleGrid>
                    </div>
                )}
            </Stack>
            <DisclaimerOverlay />
        </Page>
    )
}
