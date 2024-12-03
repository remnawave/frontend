import {
    PiCalendarDotDuotone,
    PiCalendarDotsDuotone,
    PiCalendarStarDuotone,
    PiChartDonutDuotone,
    PiChartPieSliceDuotone
} from 'react-icons/pi'
import { GetBandwidthStatsCommand } from '@remnawave/backend-contract'

export const getBandwidthMetrics = (
    bandwidthStats: GetBandwidthStatsCommand.Response['response']
) => [
    {
        icon: <PiCalendarDotDuotone color="var(--mantine-color-blue-6)" size="2rem" />,
        difference: bandwidthStats.bandwidthLastTwoDays.difference,
        period: 'from yesterday',
        title: 'Today',
        value: bandwidthStats.bandwidthLastTwoDays.current
    },
    {
        icon: <PiChartDonutDuotone color="var(--mantine-color-green-6)" size="2rem" />,
        difference: bandwidthStats.bandwidthLastSevenDays.difference,
        period: 'from last week',
        title: 'Last 7 days',
        value: bandwidthStats.bandwidthLastSevenDays.current
    },
    {
        icon: <PiChartPieSliceDuotone color="var(--mantine-color-teal-6)" size="2rem" />,
        difference: bandwidthStats.bandwidthLast30Days.difference,
        period: 'from last month',
        title: 'Last 30 days',
        value: bandwidthStats.bandwidthLast30Days.current
    },
    {
        icon: <PiCalendarDotsDuotone color="var(--mantine-color-orange-6)" size="2rem" />,
        difference: bandwidthStats.bandwidthCalendarMonth.difference,
        period: 'from last month',
        title: 'Calendar month',
        value: bandwidthStats.bandwidthCalendarMonth.current
    },
    {
        icon: <PiCalendarStarDuotone color="var(--mantine-color-cyan-6)" size="2rem" />,
        difference: bandwidthStats.bandwidthCurrentYear.difference,
        period: 'from last year',
        title: 'Current year',
        value: bandwidthStats.bandwidthCurrentYear.current
    }
]
