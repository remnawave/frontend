import { SimpleGrid } from '@mantine/core'
import { GetAllInboundsCommand } from '@remnawave/backend-contract'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { PiPulse, PiTagDuotone } from 'react-icons/pi'
import { TbUsers } from 'react-icons/tb'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'

interface IProps {
    isLoading: boolean
    inbounds: GetAllInboundsCommand.Response['response']['inbounds'] | undefined
}

export function InboundsRealtimeMetricsWidget(props: IProps) {
    const { inbounds, isLoading } = props

    const { t } = useTranslation()

    const cards: IMetricCardProps[] = [
        {
            IconComponent: PiTagDuotone,
            title: t('inbounds-realtime-metrics.widget.total-inbounds'),
            value: inbounds?.length ?? 0,
            iconVariant: 'soft',
            iconColor: 'indigo'
        },
        {
            IconComponent: PiPulse,
            title: t('inbounds-realtime-metrics.widget.active-inbounds'),
            value:
                inbounds?.filter((inbound) => inbound.onlineByNode.some((node) => node.count > 0))
                    .length ?? 0,
            iconVariant: 'soft',
            iconColor: 'teal'
        },
        {
            IconComponent: TbUsers,
            title: t('inbounds-realtime-metrics.widget.inbound-connections'),
            subtitle: t('inbounds-realtime-metrics.widget.inbound-connections-hint'),
            value:
                inbounds?.reduce(
                    (acc, curr) =>
                        acc + curr.onlineByNode.reduce((nodeAcc, node) => nodeAcc + node.count, 0),
                    0
                ) ?? 0,
            iconVariant: 'soft',
            iconColor: 'cyan'
        }
    ]

    return (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, xl: 3 }} spacing="xs">
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
