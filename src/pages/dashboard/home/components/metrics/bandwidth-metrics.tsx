import {
    PiCalendarDotDuotone,
    PiCalendarDotsDuotone,
    PiCalendarStarDuotone,
    PiChartDonutDuotone,
    PiChartPieSliceDuotone
} from 'react-icons/pi'
import { GetBandwidthStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

export const getBandwidthMetrics = (
    bandwidthStats: GetBandwidthStatsCommand.Response['response'],
    t: TFunction
) => {
    return [
        {
            icon: <PiCalendarDotDuotone color="var(--mantine-color-blue-4)" size="2rem" />,
            difference: bandwidthStats.bandwidthLastTwoDays.difference,
            period: t('bandwidth-metrics.from-yesterday'),
            title: t('bandwidth-metrics.today'),
            value: bandwidthStats.bandwidthLastTwoDays.current
        },
        {
            icon: <PiChartDonutDuotone color="var(--mantine-color-green-4)" size="2rem" />,
            difference: bandwidthStats.bandwidthLastSevenDays.difference,
            period: t('bandwidth-metrics.from-last-week'),
            title: t('bandwidth-metrics.last-7-days'),
            value: bandwidthStats.bandwidthLastSevenDays.current
        },
        {
            icon: <PiChartPieSliceDuotone color="var(--mantine-color-teal-4)" size="2rem" />,
            difference: bandwidthStats.bandwidthLast30Days.difference,
            period: t('bandwidth-metrics.from-last-month'),
            title: t('bandwidth-metrics.last-30-days'),
            value: bandwidthStats.bandwidthLast30Days.current
        },
        {
            icon: <PiCalendarDotsDuotone color="var(--mantine-color-orange-4)" size="2rem" />,
            difference: bandwidthStats.bandwidthCalendarMonth.difference,
            period: t('bandwidth-metrics.from-last-month-0'),
            title: t('bandwidth-metrics.calendar-month'),
            value: bandwidthStats.bandwidthCalendarMonth.current
        },
        {
            icon: <PiCalendarStarDuotone color="var(--mantine-color-cyan-4)" size="2rem" />,
            difference: bandwidthStats.bandwidthCurrentYear.difference,
            period: t('bandwidth-metrics.from-last-year'),
            title: t('bandwidth-metrics.current-year'),
            value: bandwidthStats.bandwidthCurrentYear.current
        }
    ]
}
