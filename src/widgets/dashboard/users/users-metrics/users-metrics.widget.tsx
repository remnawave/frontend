import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { Group, Loader, SimpleGrid } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { MetricCard } from '@shared/ui/metrics/metric-card'
import { useGetSystemStats } from '@shared/api/hooks'
import { formatInt } from '@shared/utils/misc'

export function UsersMetrics() {
    const { t } = useTranslation()

    const { data: systemInfo, isLoading } = useGetSystemStats()

    const users = systemInfo?.users

    const cards = [
        {
            icon: PiUsersDuotone,
            title: t('users-metrics.total-users'),
            value: users?.totalUsers,
            color: 'blue'
        },
        {
            icon: PiPulseDuotone,
            title: t('users-metrics.active-users'),
            value: users?.statusCounts.ACTIVE,
            color: 'teal'
        },
        {
            icon: PiClockUserDuotone,
            title: t('users-metrics.expired-users'),
            value: users?.statusCounts.EXPIRED,
            color: 'red'
        },
        {
            icon: PiClockCountdownDuotone,
            title: t('users-metrics.limited-users'),
            value: users?.statusCounts.LIMITED,
            color: 'orange'
        },
        {
            icon: PiProhibitDuotone,
            title: t('users-metrics.disabled-users'),
            value: users?.statusCounts.DISABLED,
            color: 'gray'
        }
    ]
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }}>
            {cards.map((card) => (
                <MetricCard.Root key={card.title}>
                    <Group>
                        <MetricCard.Icon c={card.color}>
                            <card.icon size="2rem" />
                        </MetricCard.Icon>
                        <div>
                            <MetricCard.TextMuted>{card.title}</MetricCard.TextMuted>
                            <MetricCard.TextEmphasis ff={'monospace'}>
                                {isLoading ? (
                                    <Loader color={card.color} size="xs" />
                                ) : (
                                    formatInt(card.value ?? 0)
                                )}
                            </MetricCard.TextEmphasis>
                        </div>
                    </Group>
                </MetricCard.Root>
            ))}
        </SimpleGrid>
    )
}
