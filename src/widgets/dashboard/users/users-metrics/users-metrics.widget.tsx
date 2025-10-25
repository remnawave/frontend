import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { Box, Group, Loader, SimpleGrid, Stack } from '@mantine/core'
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
            title: t('users-metrics.widget.total'),
            value: users?.totalUsers,
            color: 'blue'
        },
        {
            icon: PiPulseDuotone,
            title: 'Active',
            value: users?.statusCounts.ACTIVE,
            color: 'teal'
        },
        {
            icon: PiClockUserDuotone,
            title: 'Expired',
            value: users?.statusCounts.EXPIRED,
            color: 'red'
        },
        {
            icon: PiClockCountdownDuotone,
            title: 'Limited',
            value: users?.statusCounts.LIMITED,
            color: 'orange'
        },
        {
            icon: PiProhibitDuotone,
            title: 'Disabled',
            value: users?.statusCounts.DISABLED,
            color: 'gray'
        }
    ]
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }}>
            {cards.map((card) => (
                <MetricCard.Root key={card.title}>
                    <Group wrap="nowrap">
                        <MetricCard.Icon c={card.color} p="sm">
                            <card.icon size="32px" />
                        </MetricCard.Icon>
                        <Stack align="self-start" gap="xs" miw={0} w="100%">
                            <MetricCard.TextMuted>{card.title}</MetricCard.TextMuted>
                            <Box miw={0} w="100%">
                                <MetricCard.TextEmphasis ff="monospace" truncate>
                                    {isLoading ? (
                                        <Loader color={card.color} size="xs" />
                                    ) : (
                                        formatInt(card.value ?? 0)
                                    )}
                                </MetricCard.TextEmphasis>
                            </Box>
                        </Stack>
                    </Group>
                </MetricCard.Root>
            ))}
        </SimpleGrid>
    )
}
