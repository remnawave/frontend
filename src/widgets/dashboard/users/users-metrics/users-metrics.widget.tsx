import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { SimpleGrid } from '@mantine/core'
import { motion } from 'motion/react'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { useGetSystemStats } from '@shared/api/hooks'

export function UsersMetrics() {
    const { t } = useTranslation()

    const { data: systemInfo, isLoading } = useGetSystemStats()

    const users = systemInfo?.users

    const cards: IMetricCardProps[] = [
        {
            IconComponent: PiUsersDuotone,
            iconColor: 'blue',
            title: t('users-metrics.widget.total'),
            value: users?.totalUsers ?? 0,
            iconVariant: 'soft'
        },
        {
            IconComponent: PiPulseDuotone,
            iconColor: 'teal',
            title: 'Active',
            value: users?.statusCounts.ACTIVE ?? 0,
            iconVariant: 'soft'
        },
        {
            IconComponent: PiClockUserDuotone,
            iconColor: 'red',
            title: 'Expired',
            value: users?.statusCounts.EXPIRED ?? 0,
            iconVariant: 'soft'
        },
        {
            IconComponent: PiClockCountdownDuotone,
            iconColor: 'orange',
            title: 'Limited',
            value: users?.statusCounts.LIMITED ?? 0,
            iconVariant: 'soft'
        },
        {
            IconComponent: PiProhibitDuotone,
            iconColor: 'gray',
            title: 'Disabled',
            value: users?.statusCounts.DISABLED ?? 0,
            iconVariant: 'soft'
        }
    ]
    return (
        <SimpleGrid cols={{ base: 1, xs: 2, xl: 5 }} spacing="xs">
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
                >
                    <MetricCardShared
                        iconColor={card.iconColor}
                        isLoading={isLoading}
                        key={card.title}
                        {...card}
                    />
                </motion.div>
            ))}
        </SimpleGrid>
    )
}
