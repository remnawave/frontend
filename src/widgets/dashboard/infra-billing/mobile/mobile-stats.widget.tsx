import { Card, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { MdPayment, MdTrendingUp } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { TbCalendarUp } from 'react-icons/tb'
import { FaServer } from 'react-icons/fa'

import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { formatCurrency } from '@shared/utils/misc'

export function MobileStatsWidget() {
    const { data: nodes } = useGetInfraBillingNodes()
    const { t } = useTranslation()

    const stats = [
        {
            icon: FaServer,
            color: 'blue',
            value: nodes?.totalBillingNodes ?? 0,
            label: t('mobile-stats.widget.billing-nodes')
        },
        {
            icon: TbCalendarUp,
            color: 'orange',
            value: nodes?.stats.upcomingNodesCount ?? 0,
            label: t('mobile-stats.widget.upcoming')
        },
        {
            icon: MdPayment,
            color: 'green',
            value: formatCurrency(nodes?.stats.currentMonthPayments ?? 0),
            label: t('mobile-stats.widget.per-month')
        },
        {
            icon: MdTrendingUp,
            color: 'violet',
            value: formatCurrency(nodes?.stats.totalSpent ?? 0),
            label: t('mobile-stats.widget.total-spent')
        }
    ]

    return (
        <Grid gutter="xs" mb="md">
            {stats.map((stat, index) => (
                <Grid.Col key={index} span={6}>
                    <Card padding="sm">
                        <Group gap="xs" wrap="nowrap">
                            <ThemeIcon color={stat.color} radius="md" size="lg" variant="soft">
                                <stat.icon size={18} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text fw={700} size="lg">
                                    {stat.value}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {stat.label}
                                </Text>
                            </Stack>
                        </Group>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    )
}
