import { MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { FaServer } from 'react-icons/fa'
import { Grid } from '@mantine/core'
import dayjs from 'dayjs'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { formatCurrency } from '@shared/utils/misc'

export function StatsWidget() {
    const currentDate = dayjs()
    const currentMonth = currentDate.format('MMMM YYYY')
    const currentMonthOnly = currentDate.format('MMMM')
    const currentDay = currentDate.format('D')

    const { data: nodes, isLoading } = useGetInfraBillingNodes()
    const { t } = useTranslation()

    const stats: IMetricCardProps[] = [
        {
            title: t('stats.widget.current-date'),
            value: currentDay,
            subtitle: currentMonth,
            IconComponent: MdCalendarToday,
            iconVariant: 'gradient-blue'
        },
        {
            title: t('stats.widget.upcoming-in', { month: currentMonthOnly }),
            value: nodes?.stats.upcomingNodesCount ?? 0,
            subtitle: t('stats.widget.nodes-pending-payment'),
            IconComponent: FaServer,
            iconVariant: 'gradient-orange'
        },
        {
            title: t('stats.widget.payments-in', { month: currentMonthOnly }),
            value: formatCurrency(nodes?.stats.currentMonthPayments ?? 0),
            subtitle: t('stats.widget.total-payments-made'),
            IconComponent: MdPayment,
            iconVariant: 'gradient-green'
        },
        {
            title: t('stats.widget.total-spent'),
            value: formatCurrency(nodes?.stats.totalSpent ?? 0),
            subtitle: t('stats.widget.lifetime-spending'),
            IconComponent: MdTrendingUp,
            iconVariant: 'gradient-violet'
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
