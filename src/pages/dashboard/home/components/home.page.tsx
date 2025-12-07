import { SimpleGrid, Stack, Title, TitleProps } from '@mantine/core'
import { motion, Variants } from 'motion/react'
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
import { IProps } from './interfaces'

const MotionWrapper = motion.div
const MotionStack = motion.create(Stack)
const MotionGrid = motion.create(SimpleGrid)

interface IAnimatedTitleProps extends TitleProps {
    children: React.ReactNode
    variants: Variants
}

const AnimatedTitle = (props: IAnimatedTitleProps) => (
    <motion.div variants={props.variants}>
        <Title {...props}>{props.children}</Title>
    </motion.div>
)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
}

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.03
        }
    }
}

const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 }
    }
}

const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
            staggerChildren: 0.03
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.25 }
    }
}

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
            <MotionStack animate="visible" gap="sm" initial="hidden" variants={containerVariants}>
                {pm2SummaryMetrics.length > 0 && (
                    <MotionWrapper variants={sectionVariants}>
                        <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                            {t('home.page.remnawave-usage')}
                        </AnimatedTitle>

                        <MotionGrid cols={{ base: 1, sm: 2, xl: 4 }} variants={gridVariants}>
                            {pm2SummaryMetrics.map((metric) => (
                                <MotionWrapper key={metric.title} variants={cardVariants}>
                                    <MetricWithIcon {...metric} />
                                </MotionWrapper>
                            ))}
                        </MotionGrid>
                    </MotionWrapper>
                )}

                {pm2ProcessMetrics.length > 0 && (
                    <MotionWrapper variants={sectionVariants}>
                        <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                            {t('home.page.process-details')}
                        </AnimatedTitle>
                        <MotionGrid cols={{ base: 1, sm: 2, xl: 4 }} variants={gridVariants}>
                            {pm2ProcessMetrics.map((metric) => (
                                <MotionWrapper key={metric.title} variants={cardVariants}>
                                    <MetricWithIcon {...metric} />
                                </MotionWrapper>
                            ))}
                        </MotionGrid>
                    </MotionWrapper>
                )}

                <MotionWrapper variants={sectionVariants}>
                    <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                        {t('home.page.bandwidth')}
                    </AnimatedTitle>
                    <MotionGrid cols={{ base: 1, sm: 2, xl: 3 }} variants={gridVariants}>
                        {bandwidthMetrics.map((metric) => (
                            <MotionWrapper key={metric.title} variants={cardVariants}>
                                <MetricWithTrend {...metric} />
                            </MotionWrapper>
                        ))}
                    </MotionGrid>
                </MotionWrapper>

                <MotionWrapper variants={sectionVariants}>
                    <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                        {t('home.page.online-stats')}
                    </AnimatedTitle>
                    <MotionGrid cols={{ base: 1, sm: 2, xl: 4 }} variants={gridVariants}>
                        {onlineMetrics.map((metric) => (
                            <MotionWrapper key={metric.title} variants={cardVariants}>
                                <MetricWithIcon {...metric} />
                            </MotionWrapper>
                        ))}
                    </MotionGrid>
                </MotionWrapper>

                <MotionWrapper variants={sectionVariants}>
                    <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                        {t('home.page.system')}
                    </AnimatedTitle>
                    <MotionGrid cols={{ base: 1, sm: 2, xl: 3 }} variants={gridVariants}>
                        {simpleMetrics.map((metric) => (
                            <MotionWrapper key={metric.title} variants={cardVariants}>
                                <MetricWithIcon {...metric} />
                            </MotionWrapper>
                        ))}
                    </MotionGrid>
                </MotionWrapper>

                <MotionWrapper variants={sectionVariants}>
                    <AnimatedTitle m="xs" ml={0} order={4} variants={titleVariants}>
                        {t('user-table.widget.table-title')}
                    </AnimatedTitle>
                    <MotionGrid cols={{ base: 1, sm: 2, xl: 4 }} variants={gridVariants}>
                        {usersMetrics.map((metric) => (
                            <MotionWrapper key={metric.title} variants={cardVariants}>
                                <MetricWithIcon {...metric} />
                            </MotionWrapper>
                        ))}
                    </MotionGrid>
                </MotionWrapper>
            </MotionStack>
        </Page>
    )
}
