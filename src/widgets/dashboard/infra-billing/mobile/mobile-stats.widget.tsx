import { Card, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useTranslation } from 'react-i18next'
import { FaServer } from 'react-icons/fa'
import { MdPayment, MdTrendingUp } from 'react-icons/md'
import { TbAlertTriangle } from 'react-icons/tb'

import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { formatCurrency } from '@shared/utils/misc'

dayjs.extend(utc)

export function MobileStatsWidget() {
    const { data: nodes } = useGetInfraBillingNodes()
    const { t } = useTranslation()

    const today = dayjs.utc().startOf('day')
    const billingNodes = nodes?.billingNodes ?? []

    const overdueCount = billingNodes.filter((node) =>
        dayjs.utc(node.nextBillingAt).startOf('day').isBefore(today)
    ).length

    const stats = [
        {
            icon: TbAlertTriangle,
            color: overdueCount > 0 ? 'red' : 'teal',
            value: overdueCount,
            label: t('common.message.overdue')
        },
        {
            icon: FaServer,
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
        <Grid gap="xs" mb="md">
            {stats.map((stat, index) => (
                <Grid.Col key={index} span={6}>
                    <Card padding="sm">
                        <Group gap="xs" wrap="nowrap">
                            <ThemeIcon color={stat.color} radius="md" size="lg" variant="soft">
                                <stat.icon size={18} />
                            </ThemeIcon>
                            <Stack gap={0} miw={0}>
                                <Text fw={700} size="lg" truncate="end">
                                    {stat.value}
                                </Text>
                                <Text c="dimmed" size="xs" truncate="end">
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
