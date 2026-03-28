import {
    PiCalendarDotDuotone,
    PiCalendarDotsDuotone,
    PiCalendarStarDuotone,
    PiChartDonutDuotone,
    PiChartPieSliceDuotone
} from 'react-icons/pi'
import { GetBandwidthStatsCommand } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'

import { IMetricCardWithTrendProps } from '@shared/ui/metrics/metric-card'

export const getBandwidthMetrics = (
    bandwidthStats: GetBandwidthStatsCommand.Response['response'],
    t: TFunction
): IMetricCardWithTrendProps[] => {
    return [
        {
            IconComponent: PiCalendarDotDuotone,
            iconVariant: 'soft',
            iconColor: 'blue',
            difference: bandwidthStats.bandwidthLastTwoDays.difference,
            period: t('bandwidth-metrics.from-yesterday'),
            title: t('bandwidth-metrics.today'),
            value: bandwidthStats.bandwidthLastTwoDays.current
        },
        {
            IconComponent: PiChartDonutDuotone,
            iconVariant: 'soft',
            iconColor: 'green',
            difference: bandwidthStats.bandwidthLastSevenDays.difference,
            period: t('bandwidth-metrics.from-last-week'),
            title: t('bandwidth-metrics.last-7-days'),
            value: bandwidthStats.bandwidthLastSevenDays.current
        },
        {
            IconComponent: PiChartPieSliceDuotone,
            iconVariant: 'soft',
            iconColor: 'teal',
            difference: bandwidthStats.bandwidthLast30Days.difference,
            period: t('bandwidth-metrics.from-last-month'),
            title: t('bandwidth-metrics.last-30-days'),
            value: bandwidthStats.bandwidthLast30Days.current
        },
        {
            IconComponent: PiCalendarDotsDuotone,
            iconVariant: 'soft',
            iconColor: 'orange',
            difference: bandwidthStats.bandwidthCalendarMonth.difference,
            period: t('bandwidth-metrics.from-last-month-0'),
            title: t('bandwidth-metrics.calendar-month'),
            value: bandwidthStats.bandwidthCalendarMonth.current
        },
        {
            IconComponent: PiCalendarStarDuotone,
            iconVariant: 'soft',
            iconColor: 'cyan',
            difference: bandwidthStats.bandwidthCurrentYear.difference,
            period: t('bandwidth-metrics.from-last-year'),
            title: t('bandwidth-metrics.current-year'),
            value: bandwidthStats.bandwidthCurrentYear.current
        }
    ]
}
