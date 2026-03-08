import { TbClockHour2, TbFileReport, TbServer, TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { SimpleGrid } from '@mantine/core'
import { motion } from 'motion/react'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { useGetTorrentBlockerStats } from '@shared/api/hooks'

export function TorrentBlockerStatsWidget() {
    const { t } = useTranslation()

    const { data: stats, isLoading: isStatsLoading } = useGetTorrentBlockerStats()

    const cards: IMetricCardProps[] = [
        {
            IconComponent: TbFileReport,
            title: t('torrent-blocker-stats.widget.total-reports'),
            value: stats?.stats.totalReports ?? 0,
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            IconComponent: TbClockHour2,
            title: t('torrent-blocker-stats.widget.last-24-hours'),
            value: stats?.stats.reportsLast24Hours ?? 0,
            iconVariant: 'soft',
            iconColor: 'cyan'
        },
        {
            IconComponent: TbServer,
            title: t('torrent-blocker-stats.widget.distinct-nodes'),
            value: stats?.stats.distinctNodes ?? 0,
            iconVariant: 'soft',
            iconColor: 'teal'
        },
        {
            IconComponent: TbUsers,
            title: t('torrent-blocker-stats.widget.distinct-users'),
            value: stats?.stats.distinctUsers ?? 0,
            iconVariant: 'soft',
            iconColor: 'red'
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
                        isLoading={isStatsLoading}
                        subtitle={card.subtitle}
                        title={card.title}
                        value={card.value}
                    />
                </motion.div>
            ))}
        </SimpleGrid>
    )
}
