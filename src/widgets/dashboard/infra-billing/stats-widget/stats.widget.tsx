import { MdCalendarToday, MdPayment, MdTrendingUp } from 'react-icons/md'
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

    const stats = [
        {
            title: 'Current Date',
            value: currentDay,
            subtitle: currentMonth,
            icon: <MdCalendarToday size={24} />,
            color: 'blue'
        },
        {
            title: `Upcoming in ${currentMonthOnly}`,
            value: nodes?.stats.upcomingNodesCount ?? 0,
            subtitle: 'nodes pending payment',
            icon: <FaServer size={24} />,
            color: 'orange'
        },
        {
            title: `Payments in ${currentMonthOnly}`,
            value: formatCurrency(nodes?.stats.currentMonthPayments ?? 0),
            subtitle: 'total payments made',
            icon: <MdPayment size={24} />,
            color: 'green'
        },
        {
            title: 'Total Spent',
            value: formatCurrency(nodes?.stats.totalSpent ?? 0),
            subtitle: 'lifetime spending',
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
                        subtitle={stat.subtitle}
                        title={stat.title}
                        value={stat.value}
                    />
                </Grid.Col>
            ))}
        </Grid>
    )
}
