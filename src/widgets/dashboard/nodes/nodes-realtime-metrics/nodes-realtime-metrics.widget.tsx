import { SimpleGrid } from '@mantine/core'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PiArrowDownDuotone, PiArrowUpDuotone, PiPulse } from 'react-icons/pi'
import { TbUsers } from 'react-icons/tb'

import { useGetSystemStats } from '@shared/api/hooks'
import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { prettySiRealtimeBytesUtil } from '@shared/utils/bytes'

interface IProps {
    isLoading: boolean
    nodes: GetNodesCommand.Response['response'] | undefined
}

export function NodesRealtimeUsageMetrics(props: IProps) {
    const { nodes, isLoading } = props

    const { t } = useTranslation()

    const { data: systemInfo } = useGetSystemStats()

    const aggregated = useMemo(() => {
        if (!nodes?.length) return null

        return nodes.reduce(
            (acc, curr) => ({
                rxSpeed: acc.rxSpeed + (curr.system?.stats.interface?.rxBytesPerSec ?? 0),
                txSpeed: acc.txSpeed + (curr.system?.stats.interface?.txBytesPerSec ?? 0)
            }),
            { rxSpeed: 0, txSpeed: 0 }
        )
    }, [nodes])

    const cards: IMetricCardProps[] = [
        {
            IconComponent: PiArrowDownDuotone,
            title: t('nodes-realtime-metrics.widget.download-speed'),
            value: prettySiRealtimeBytesUtil(aggregated?.rxSpeed, true, true) || '0 B/s',
            iconVariant: 'soft',
            iconColor: 'teal'
        },
        {
            IconComponent: PiArrowUpDuotone,
            title: t('nodes-realtime-metrics.widget.upload-speed'),
            value: prettySiRealtimeBytesUtil(aggregated?.txSpeed ?? 0, true, true) || '0 B/s',
            iconVariant: 'soft',
            iconColor: 'indigo'
        },

        {
            IconComponent: TbUsers,
            title: t('nodes-quick-stats.widget.users-online'),
            // A user connected through several nodes (balancer, auto-select) counts once here; the per-node sum counts sessions.
            value: systemInfo?.onlineStats.onlineNow ?? 0,
            subtitle: t('nodes-quick-stats.widget.sessions-on-nodes', {
                total: nodes?.reduce((acc, curr) => acc + (curr.usersOnline ?? 0), 0) ?? 0
            }),
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            IconComponent: PiPulse,
            title: t('nodes-quick-stats.widget.online-nodes'),
            value: nodes?.filter((node) => node.isConnected).length ?? 0,
            iconVariant: 'soft',
            iconColor: 'teal'
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
