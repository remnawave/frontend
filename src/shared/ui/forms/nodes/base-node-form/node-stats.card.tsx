import {
    CreateNodeCommand,
    GetOneNodeCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { Badge, Box, Fieldset, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { PiArrowsCounterClockwise } from 'react-icons/pi'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useCallback, useMemo } from 'react'
import { TbChartBar } from 'react-icons/tb'

import { getNodeResetDaysUtil, getXrayUptimeUtil } from '@shared/utils/time-utils'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { XrayLogo } from '@shared/ui/logos'

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    node: GetOneNodeCommand.Response['response']
}

export const NodeStatsCard = <T extends CreateNodeCommand.Request | UpdateNodeCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, motionWrapper, node } = props

    const MotionWrapper = motionWrapper

    const trafficData = useMemo(() => {
        let maxData = '∞'
        let percentage = 0

        const prettyUsedData = prettyBytesToAnyUtil(node.trafficUsedBytes || 0) || '0 B'

        if (node.isTrafficTrackingActive) {
            maxData = prettyBytesToAnyUtil(node.trafficLimitBytes || 0) || '∞'
            if (node.trafficLimitBytes === 0) {
                percentage = 100
            } else {
                percentage = Math.floor(
                    ((node.trafficUsedBytes ?? 0) * 100) / (node.trafficLimitBytes ?? 0)
                )
            }
        }

        return {
            maxData,
            percentage,
            prettyUsedData,
            fallbackProgress: node.isTrafficTrackingActive && node.trafficLimitBytes === 0
        }
    }, [node.trafficUsedBytes, node.trafficLimitBytes, node.isTrafficTrackingActive])

    const isOnline = useMemo(() => {
        return node?.isConnected && node?.xrayUptime !== '0'
    }, [node?.isConnected, node?.xrayUptime])

    const getProgressColor = useCallback(() => {
        if (trafficData.fallbackProgress) return 'teal.6'
        if (trafficData.percentage > 95) return 'red.6'
        if (trafficData.percentage > 80) return 'yellow.6'
        return 'teal.6'
    }, [trafficData.percentage, trafficData.fallbackProgress])

    const getTrafficBadgeColor = useCallback(() => {
        if (!node?.isTrafficTrackingActive) return 'teal'
        if (trafficData.percentage > 95) return 'red'
        if (trafficData.percentage > 80) return 'yellow'
        return 'teal'
    }, [node?.isTrafficTrackingActive, trafficData.percentage])

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbChartBar color="var(--mantine-color-indigo-4)" size={20} />
                        <Title c="indigo.4" order={4}>
                            {t('node-stats.card.stats')}
                        </Title>

                        {node.isTrafficTrackingActive && !trafficData.fallbackProgress && (
                            <Badge color={getTrafficBadgeColor()} size="md" variant="outline">
                                {trafficData.percentage}%
                            </Badge>
                        )}

                        {isOnline && (
                            <Tooltip
                                label={t('node-stats.card.represents-the-uptime-of-the-xray-core')}
                            >
                                <Badge
                                    color="white"
                                    leftSection={<XrayLogo size={14} />}
                                    size="md"
                                    variant="outline"
                                >
                                    {getXrayUptimeUtil(node.xrayUptime)}
                                </Badge>
                            </Tooltip>
                        )}
                    </Group>
                }
            >
                <Stack gap="lg">
                    <Stack gap="sm">
                        <Box>
                            <Group justify="space-between" mb={4}>
                                <Text
                                    c={isOnline ? undefined : 'dimmed'}
                                    ff="monospace"
                                    fw={700}
                                    size="md"
                                >
                                    {trafficData.prettyUsedData}
                                </Text>
                                <Text c="dimmed" size="sm">
                                    {trafficData.maxData}
                                </Text>
                            </Group>

                            <Progress
                                color={node.isTrafficTrackingActive ? getProgressColor() : 'teal'}
                                radius="sm"
                                size="md"
                                value={node.isTrafficTrackingActive ? trafficData.percentage : 100}
                            />
                        </Box>

                        {node.isTrafficTrackingActive && (
                            <Group gap="xs" justify="center">
                                <PiArrowsCounterClockwise
                                    color="var(--mantine-color-indigo-6)"
                                    size={14}
                                />
                                <Text c="indigo.6" fw={600} size="xs">
                                    {t('node-stats.card.traffic-refill-in-days')}{' '}
                                    {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
