import {
    FaArrowRight,
    FaCalendarAlt,
    FaCalendarCheck,
    FaClock,
    FaExclamationCircle,
    FaExclamationTriangle
} from 'react-icons/fa'
import { Box, Group, Text, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'

type DateStatus = 'far-future' | 'far-past' | 'near-future' | 'today' | 'tomorrow' | 'yesterday'

interface DateStatusConfig {
    color: string
    icon: React.ReactNode
    tooltipText: string
}

interface Props {
    nextBillingAt: Date
}

function getDateStatus(date: Date): DateStatus {
    const now = dayjs().startOf('day')
    const targetDate = dayjs(date).startOf('day')

    const diffInDays = targetDate.diff(now, 'day')

    if (diffInDays === -1) return 'yesterday'
    if (diffInDays <= -2) return 'far-past'
    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'tomorrow'
    if (diffInDays >= 2 && diffInDays <= 7) return 'near-future'
    return 'far-future'
}

function getStatusConfig(status: DateStatus): DateStatusConfig {
    switch (status) {
        case 'far-future':
            return {
                color: 'gray',
                icon: <FaCalendarAlt size={12} />,
                tooltipText: 'Far future'
            }
        case 'far-past':
            return {
                color: 'red',
                icon: <FaExclamationTriangle size={12} />,
                tooltipText: 'More than 3 days ago'
            }
        case 'near-future':
            return {
                color: 'blue',
                icon: <FaArrowRight size={12} />,
                tooltipText: 'Date approaching'
            }
        case 'today':
            return {
                color: 'red',
                icon: <FaClock size={12} />,
                tooltipText: 'Today'
            }
        case 'tomorrow':
            return {
                color: 'blue',
                icon: <FaArrowRight size={12} />,
                tooltipText: 'Tomorrow'
            }
        case 'yesterday':
            return {
                color: 'red',
                icon: <FaExclamationCircle size={12} />,
                tooltipText: 'Yesterday'
            }
        default:
            return {
                color: 'gray',
                icon: <FaCalendarAlt size={12} />,
                tooltipText: 'Far future'
            }
    }
}

export function InfraBillingNodesTableNextBillingAtCell({ nextBillingAt }: Props) {
    const status = getDateStatus(nextBillingAt)
    const statusConfig = getStatusConfig(status)

    const isCurrentMonth = dayjs(nextBillingAt).isSame(dayjs(), 'month')

    return (
        <Group align="center" gap={6} justify="flex-end">
            <Tooltip label={statusConfig.tooltipText}>
                <Box c={statusConfig.color}>{statusConfig.icon}</Box>
            </Tooltip>

            <Text c={statusConfig.color} fw={600} size="sm">
                {dayjs(nextBillingAt).format('D MMMM, YYYY')}
            </Text>

            {isCurrentMonth && (
                <Tooltip label="In current month">
                    <Box c="grape">
                        <FaCalendarCheck size={10} />
                    </Box>
                </Tooltip>
            )}
        </Group>
    )
}
