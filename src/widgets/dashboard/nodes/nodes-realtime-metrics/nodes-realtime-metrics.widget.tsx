import {
    PiArrowDownDuotone,
    PiArrowUpDuotone,
    PiPulse,
    PiSpeedometer,
    PiWarningCircle
} from 'react-icons/pi'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { TbServer2, TbSum, TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { SimpleGrid } from '@mantine/core'
import { motion } from 'motion/react'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { prettyBytesToAnyUtil, prettyRealtimeBytesUtil } from '@shared/utils/bytes'
import { useGetStatsNodesRealtimeUsage } from '@shared/api/hooks'

interface IProps {
    isLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | undefined
}

export function NodesRealtimeUsageMetrics(props: IProps) {
    const { nodes, isLoading } = props

    const { t } = useTranslation()

    const { data: nodesRealtimeUsage, isLoading: isNodesRealtimeUsageLoading } =
        useGetStatsNodesRealtimeUsage()

    const cards: IMetricCardProps[] = [
        {
            IconComponent: TbUsers,
            title: t('nodes-quick-stats.widget.users-online'),
            value: nodes?.reduce((acc, curr) => acc + (curr.usersOnline ?? 0), 0) ?? 0,
            iconVariant: 'gradient-cyan'
        },
        {
            IconComponent: PiPulse,
            title: t('nodes-quick-stats.widget.online-nodes'),
            value: nodes?.filter((node) => node.isConnected).length ?? 0,
            iconVariant: 'gradient-teal'
        },
        {
            IconComponent: PiWarningCircle,
            title: t('nodes-quick-stats.widget.offline-nodes'),
            value: nodes?.filter((node) => !node.isConnected).length ?? 0,
            iconVariant: 'gradient-red'
        },
        {
            IconComponent: TbSum,
            title: t('nodes-quick-stats.widget.cumulative-traffic'),
            value: prettyBytesToAnyUtil(
                nodes?.reduce((acc, curr) => acc + (curr.trafficUsedBytes ?? 0), 0) ?? 0,
                true
            ),
            iconVariant: 'gradient-cyan'
        },
        {
            IconComponent: PiArrowUpDuotone,
            title: t('nodes-realtime-metrics.widget.total-upload'),
            subtitle: t('nodes-realtime-metrics.widget.current-hour'),
            value:
                prettyRealtimeBytesUtil(
                    nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.uploadBytes, 0),
                    true,
                    false
                ) ?? 0,
            iconVariant: 'gradient-blue'
        },

        {
            IconComponent: PiArrowDownDuotone,
            title: t('nodes-realtime-metrics.widget.total-download'),
            subtitle: t('nodes-realtime-metrics.widget.current-hour'),
            value:
                prettyRealtimeBytesUtil(
                    nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.downloadBytes, 0),
                    true,
                    false
                ) ?? 0,
            iconVariant: 'gradient-teal'
        },
        {
            IconComponent: PiSpeedometer,
            title: t('nodes-realtime-metrics.widget.average-bps'),
            subtitle: t('nodes-realtime-metrics.widget.current-hour'),
            value:
                prettyRealtimeBytesUtil(
                    nodesRealtimeUsage?.reduce((acc, curr) => acc + curr.totalSpeedBps, 0),
                    true,
                    true
                ) ?? 0,
            iconVariant: 'gradient-indigo'
        },
        {
            IconComponent: TbServer2,
            title: t('nodes-realtime-metrics.widget.active-nodes'),
            value: nodesRealtimeUsage?.length || 0,
            iconVariant: 'gradient-indigo',
            subtitle: t('nodes-realtime-metrics.widget.current-hour')
        }
    ]
    return (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, xl: 4 }} spacing="xs">
            {cards.map((card, index) => (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 0 }}
                    key={card.title}
                    transition={{
                        duration: 0.15,
                        delay: index * 0.03,
                        ease: 'easeIn'
                    }}
                >
                    <MetricCardShared
                        IconComponent={card.IconComponent}
                        iconVariant={card.iconVariant}
                        isLoading={isNodesRealtimeUsageLoading || isLoading}
                        subtitle={card.subtitle}
                        title={card.title}
                        value={card.value}
                    />
                </motion.div>
            ))}
        </SimpleGrid>
    )
}
