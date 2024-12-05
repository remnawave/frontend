import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { Group, Loader, SimpleGrid } from '@mantine/core'

import { MetricCard } from '@shared/ui/metrics/metric-card'
import { useGetSystemStats } from '@shared/api/hooks'
import { formatInt } from '@shared/utils/number'

export function UsersMetrics() {
    const { data: systemInfo, isLoading } = useGetSystemStats()

    const users = systemInfo?.users

    const cards = [
        { icon: PiUsersDuotone, title: 'Total users', value: users?.totalUsers, color: 'blue' },
        {
            icon: PiPulseDuotone,
            title: 'Active users',
            value: users?.statusCounts.ACTIVE,
            color: 'teal'
        },
        {
            icon: PiClockUserDuotone,
            title: 'Expired users',
            value: users?.statusCounts.EXPIRED,
            color: 'red'
        },
        {
            icon: PiClockCountdownDuotone,
            title: 'Limited users',
            value: users?.statusCounts.LIMITED,
            color: 'orange'
        },
        {
            icon: PiProhibitDuotone,
            title: 'Disabled users',
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
