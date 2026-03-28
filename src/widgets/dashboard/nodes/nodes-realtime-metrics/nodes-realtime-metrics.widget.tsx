import { PiArrowDownDuotone, PiArrowUpDuotone, PiPulse, PiWarningCircle } from 'react-icons/pi'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { TbServer2, TbSum, TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { SimpleGrid } from '@mantine/core'
import { motion } from 'motion/react'
import { useMemo } from 'react'

import {
    prettyBytesToAnyUtil,
    prettySiBytesUtil,
    prettySiRealtimeBytesUtil
} from '@shared/utils/bytes'
import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'

interface IProps {
    isLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | undefined
}

export function NodesRealtimeUsageMetrics(props: IProps) {
    const { nodes, isLoading } = props

    const { t } = useTranslation()

    const aggregated = useMemo(() => {
        if (!nodes?.length) return null

        return nodes.reduce(
            (acc, curr) => ({
                rxTotal: acc.rxTotal + (curr.system?.stats.interface?.rxTotal ?? 0),
                txTotal: acc.txTotal + (curr.system?.stats.interface?.txTotal ?? 0),
                rxSpeed: acc.rxSpeed + (curr.system?.stats.interface?.rxBytesPerSec ?? 0),
                txSpeed: acc.txSpeed + (curr.system?.stats.interface?.txBytesPerSec ?? 0),
                memoryUsed: acc.memoryUsed + (curr.system?.stats.memoryUsed ?? 0)
            }),
            { rxTotal: 0, txTotal: 0, rxSpeed: 0, txSpeed: 0, memoryUsed: 0 }
        )
    }, [nodes])

    const cards: IMetricCardProps[] = [
        {
            IconComponent: TbUsers,
            title: t('nodes-quick-stats.widget.users-online'),
            value: nodes?.reduce((acc, curr) => acc + (curr.usersOnline ?? 0), 0) ?? 0,
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            IconComponent: PiPulse,
            title: t('nodes-quick-stats.widget.online-nodes'),
            value: nodes?.filter((node) => node.isConnected).length ?? 0,
            iconVariant: 'soft',
            iconColor: 'teal'
        },
        {
            IconComponent: PiWarningCircle,
            title: t('nodes-quick-stats.widget.offline-nodes'),
            value: nodes?.filter((node) => !node.isConnected).length ?? 0,
            iconVariant: 'soft',
            iconColor: 'red'
        },
        {
            IconComponent: TbSum,
            title: t('nodes-quick-stats.widget.cumulative-traffic'),
            value: prettyBytesToAnyUtil(
                nodes?.reduce((acc, curr) => acc + (curr.trafficUsedBytes ?? 0), 0) ?? 0,
                true
            ),
            iconVariant: 'soft',
            iconColor: 'cyan'
        },

        {
            IconComponent: PiArrowDownDuotone,
            title: t('nodes-realtime-metrics.widget.download-speed'),
            value: prettySiRealtimeBytesUtil(aggregated?.rxSpeed ?? 0, true, true) || '0 B/s',
            iconVariant: 'soft',
            iconColor: 'teal',
            subtitle: t('node-system-card.widget.interface')
        },
        {
            IconComponent: PiArrowUpDuotone,
            title: t('nodes-realtime-metrics.widget.upload-speed'),
            value: prettySiRealtimeBytesUtil(aggregated?.txSpeed ?? 0, true, true) || '0 B/s',
            iconVariant: 'soft',
            iconColor: 'indigo',
            subtitle: t('node-system-card.widget.interface')
        },
        {
            IconComponent: PiArrowDownDuotone,
            title: t('nodes-realtime-metrics.widget.download-total'),
            value: prettySiBytesUtil(aggregated?.rxTotal ?? 0, true) || '0 B',
            iconVariant: 'soft',
            iconColor: 'teal',
            subtitle: t('node-system-card.widget.interface')
        },
        {
            IconComponent: TbServer2,
            title: t('nodes-realtime-metrics.widget.ram-usage'),
            value: prettyBytesToAnyUtil(aggregated?.memoryUsed ?? 0, true) || '0 B',
            iconVariant: 'soft',
            iconColor: 'indigo',
            subtitle: t('nodes-realtime-metrics.widget.for-all-nodes')
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
                        iconColor={card.iconColor}
                        IconComponent={card.IconComponent}
                        iconVariant={card.iconVariant}
                        isLoading={isLoading}
                        subtitle={card.subtitle}
                        title={card.title}
                        value={card.value}
                    />
                </motion.div>
            ))}
        </SimpleGrid>
    )
}
