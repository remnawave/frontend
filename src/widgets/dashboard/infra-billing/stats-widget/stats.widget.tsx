import { Grid } from '@mantine/core'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { FaServer } from 'react-icons/fa'
import { MdPayment, MdTrendingUp } from 'react-icons/md'
import { TbAlertTriangle } from 'react-icons/tb'

import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { formatCurrency } from '@shared/utils/misc'

export function StatsWidget() {
    const currentMonthOnly = dayjs().format('MMMM')

    const { data: nodes, isLoading } = useGetInfraBillingNodes()
    const { t } = useTranslation()

    const today = dayjs().startOf('day')
    const billingNodes = nodes?.billingNodes ?? []

    const overdueCount = billingNodes.filter((node) =>
        dayjs(node.nextBillingAt).startOf('day').isBefore(today)
    ).length

    const stats: IMetricCardProps[] = [
        {
            title: t('common.message.overdue'),
            value: overdueCount,
            subtitle:
                overdueCount > 0
                    ? t('stats.widget.payment-overdue')
                    : t('stats.widget.all-up-to-date'),
            IconComponent: TbAlertTriangle,
            iconColor: overdueCount > 0 ? 'red' : 'teal',
            iconVariant: 'soft'
        },
        {
            title: t('stats.widget.upcoming-in', { month: currentMonthOnly }),
            value: nodes?.stats.upcomingNodesCount ?? 0,
            subtitle: t('stats.widget.nodes-pending-payment'),
            IconComponent: FaServer,
            iconColor: 'orange',
            iconVariant: 'soft'
        },
        {
            title: t('stats.widget.payments-in', { month: currentMonthOnly }),
            value: formatCurrency(nodes?.stats.currentMonthPayments ?? 0),
            subtitle: t('stats.widget.total-payments-made'),
            IconComponent: MdPayment,
            iconColor: 'green',
            iconVariant: 'soft'
        },
        {
            title: t('stats.widget.total-spent'),
            value: formatCurrency(nodes?.stats.totalSpent ?? 0),
            subtitle: t('stats.widget.lifetime-spending'),
            IconComponent: MdTrendingUp,
            iconColor: 'violet',
            iconVariant: 'soft'
        }
    ]

    return (
        <Grid mb="md">
            {stats.map((stat, index) => (
                <Grid.Col key={index} span={{ base: 12, xs: 6, md: 6, sm: 6, lg: 3 }}>
                    <MetricCardShared isLoading={isLoading} key={index} {...stat} />
                </Grid.Col>
            ))}
        </Grid>
    )
}
