import { Box, Group } from '@mantine/core'

import { MetricCard } from '@shared/ui/metrics/metric-card'

import { IProps } from './interfaces/iprops'

export const MetricWithTrend = (props: IProps) => {
    const { title, value, difference, period, icon } = props
    return (
        <MetricCard.Root key={title}>
            <Group wrap="nowrap">
                <MetricCard.Icon>{icon}</MetricCard.Icon>
                <Box miw={0} w={'100%'}>
                    <MetricCard.TextMuted truncate>{title}</MetricCard.TextMuted>
                    <MetricCard.TextEmphasis ff={'monospace'} truncate>
                        {value}
                    </MetricCard.TextEmphasis>
                    <MetricCard.TextTrend truncate value={difference}>
                        {period ?? 'last month'}
                    </MetricCard.TextTrend>
                </Box>
            </Group>
        </MetricCard.Root>
    )
}
