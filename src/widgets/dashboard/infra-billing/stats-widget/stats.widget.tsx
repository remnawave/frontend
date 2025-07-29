import { MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { FaServer } from 'react-icons/fa'
import { Grid } from '@mantine/core'
import dayjs from 'dayjs'

import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { formatCurrency } from '@shared/utils/misc'

import { StatCardWidget } from './stat-card.widget'

export function StatsWidget() {
    const currentDate = dayjs()
    const currentMonth = currentDate.format('MMMM YYYY')
    const currentMonthOnly = currentDate.format('MMMM')
    const currentDay = currentDate.format('D')

    const { data: nodes, isLoading } = useGetInfraBillingNodes()
    const { t } = useTranslation()

    const stats = [
        {
            title: t('stats.widget.current-date'),
            value: currentDay,
            subtitle: currentMonth,
            icon: <MdCalendarToday size={24} />,
            color: 'blue'
        },
        {
            title: t('stats.widget.upcoming-in', { month: currentMonthOnly }),
            value: nodes?.stats.upcomingNodesCount ?? 0,
            subtitle: t('stats.widget.nodes-pending-payment'),
            icon: <FaServer size={24} />,
            color: 'orange'
        },
        {
            title: t('stats.widget.payments-in', { month: currentMonthOnly }),
            value: formatCurrency(nodes?.stats.currentMonthPayments ?? 0),
            subtitle: t('stats.widget.total-payments-made'),
            icon: <MdPayment size={24} />,
            color: 'green'
        },
        {
            title: t('stats.widget.total-spent'),
            value: formatCurrency(nodes?.stats.totalSpent ?? 0),
            subtitle: t('stats.widget.lifetime-spending'),
            icon: <MdTrendingUp size={24} />,
            color: 'violet'
        }
    ]

    return (
        <Grid mb="xl">
            {stats.map((stat, index) => (
                <Grid.Col key={index} span={{ base: 12, xs: 6, md: 3 }}>
                    <StatCardWidget
                        color={stat.color}
                        icon={stat.icon}
                        isLoading={isLoading}
                        key={index}
                        subtitle={stat.subtitle}
                        title={stat.title}
                        value={stat.value}
                    />
                </Grid.Col>
            ))}
        </Grid>
    )
}
