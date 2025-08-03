import { PiArrowDownDuotone, PiArrowUpDuotone, PiSpeedometer } from 'react-icons/pi'
import { Box, Group, Loader, SimpleGrid } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer2 } from 'react-icons/tb'
import { motion } from 'motion/react'

import { prettyRealtimeBytesUtil } from '@shared/utils/bytes'
import { useGetNodesRealtimeUsage } from '@shared/api/hooks'
import { MetricCard } from '@shared/ui/metrics/metric-card'

export function NodesRealtimeUsageMetrics() {
    const { t } = useTranslation()

    const { data: nodesRealtimeUsage, isLoading: isNodesRealtimeUsageLoading } =
        useGetNodesRealtimeUsage()

    const cards = [
        {
            icon: PiArrowUpDuotone,
            title: t('nodes-realtime-metrics.widget.total-upload'),
            value: prettyRealtimeBytesUtil(
                nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.uploadBytes, 0),
                true,
                false
            ),
            color: 'blue'
        },

        {
            icon: PiArrowDownDuotone,
            title: t('nodes-realtime-metrics.widget.total-download'),
            value: prettyRealtimeBytesUtil(
                nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.downloadBytes, 0),
                true,
                false
            ),
            color: 'teal'
        },
        {
            icon: PiSpeedometer,
            title: t('nodes-realtime-metrics.widget.average-bps'),
            value: prettyRealtimeBytesUtil(
                nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.totalSpeedBps, 0),
                true,
                true
            ),
            color: 'teal'
        },
        {
            icon: TbServer2,
            title: t('nodes-realtime-metrics.widget.active-nodes'),
            value: nodesRealtimeUsage?.length,
            color: 'teal'
        }
    ]
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
            {cards.map((card, index) => (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 0 }}
                    key={card.title}
                    transition={{
                        duration: 0.2,
                        delay: index * 0.07,
                        ease: 'easeIn'
                    }}
                    whileHover={{ y: -1 }}
                >
                    <MetricCard.Root key={card.title}>
                        <Group wrap="nowrap">
                            <MetricCard.Icon c={card.color}>
                                <card.icon size="32px" />
                            </MetricCard.Icon>
                            <Box miw={0}>
                                <MetricCard.TextMuted truncate>{card.title}</MetricCard.TextMuted>
                                <MetricCard.TextEmphasis ff={'monospace'}>
                                    {isNodesRealtimeUsageLoading ? (
                                        <Loader color={card.color} size="xs" />
                                    ) : (
                                        card.value
                                    )}
                                </MetricCard.TextEmphasis>
                                <MetricCard.TextMuted truncate>
                                    {t('nodes-realtime-metrics.widget.current-hour')}
                                </MetricCard.TextMuted>
                            </Box>
                        </Group>
                    </MetricCard.Root>
                </motion.div>
            ))}
        </SimpleGrid>
    )
}
