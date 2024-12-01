import { Group } from '@mantine/core'

import { MetricCard } from '@/shared/ui/metrics/metric-card'

import { IProps } from './interfaces/iprops'

export const MetricWithTrend = (props: IProps) => {
    const { title, value, color, percentage, period, icon } = props
    return (
        <MetricCard.Root key={title}>
            <Group>
                <MetricCard.Icon color={color}>{icon}</MetricCard.Icon>
                <div>
                    <MetricCard.TextMuted>{title}</MetricCard.TextMuted>
                    <MetricCard.TextEmphasis ff={'monospace'}>{value}</MetricCard.TextEmphasis>
                    <MetricCard.TextTrend value={percentage}>
                        {period ?? 'last month'}
                    </MetricCard.TextTrend>
                </div>
            </Group>
        </MetricCard.Root>
    )
}
