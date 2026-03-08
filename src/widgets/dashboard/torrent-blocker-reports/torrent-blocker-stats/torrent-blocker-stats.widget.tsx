import { TbClockHour2, TbFileReport, TbServer, TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { SimpleGrid } from '@mantine/core'
import { motion } from 'motion/react'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetTorrentBlockerStats } from '@shared/api/hooks'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

export function TorrentBlockerStatsWidget() {
    const { t } = useTranslation()

    const { data: stats, isLoading: isStatsLoading } = useGetTorrentBlockerStats()

    const userModalActions = useUserModalStoreActions()

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
        <>
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
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TopLeaderboardCardShared
                    emptyText={t('user-usage-modal.widget.no-data-available')}
                    formatValue={(value) => formatInt(value)}
                    isLoading={isStatsLoading}
                    items={stats?.topUsers?.map((user) => ({
                        color: user.color,
                        name: user.username,
                        total: user.total,
                        uuid: user.uuid
                    }))}
                    maxHeight={230}
                    onItemClick={(user) => {
                        userModalActions.setUserUuid(user.uuid)
                        userModalActions.changeModalState(true)
                    }}
                    wrapper={(children) => (
                        <SectionCard.Root>
                            <SectionCard.Section>
                                <BaseOverlayHeader
                                    iconColor="red"
                                    IconComponent={TbUsers}
                                    iconVariant="soft"
                                    subtitle={t('torrent-blocker-stats.widget.by-report-count')}
                                    title={t('torrent-blocker-stats.widget.top-users')}
                                    titleOrder={5}
                                />
                            </SectionCard.Section>
                            <SectionCard.Section>{children}</SectionCard.Section>
                        </SectionCard.Root>
                    )}
                />

                <TopLeaderboardCardShared
                    emptyText={t('user-usage-modal.widget.no-data-available')}
                    formatValue={(value) => formatInt(value)}
                    isLoading={isStatsLoading}
                    items={stats?.topNodes?.map((node) => ({
                        color: node.color,
                        countryCode: node.countryCode,
                        name: node.name,
                        total: node.total
                    }))}
                    maxHeight={230}
                    renderCountryFlag={(item) => <CountryFlag countryCode={item.countryCode} />}
                    wrapper={(children) => (
                        <SectionCard.Root>
                            <SectionCard.Section>
                                <BaseOverlayHeader
                                    iconColor="teal"
                                    IconComponent={TbServer}
                                    iconVariant="soft"
                                    subtitle={t('torrent-blocker-stats.widget.by-report-count')}
                                    title={t('statistic-nodes.component.top-nodes')}
                                    titleOrder={5}
                                />
                            </SectionCard.Section>
                            <SectionCard.Section>{children}</SectionCard.Section>
                        </SectionCard.Root>
                    )}
                />
            </SimpleGrid>
        </>
    )
}
