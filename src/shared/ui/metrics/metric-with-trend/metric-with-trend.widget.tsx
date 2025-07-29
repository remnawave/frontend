import { Flex, Stack } from '@mantine/core'

import { MetricCard } from '@shared/ui/metrics/metric-card'

import { IProps } from './interfaces/iprops'

export const MetricWithTrend = (props: IProps) => {
    const { title, value, difference, period, icon } = props
    return (
        <MetricCard.Root key={title}>
            <Stack gap="0" h="100%">
                <Flex align="flex-start" justify="space-between">
                    <MetricCard.TextMuted style={{ flex: 1 }} truncate>
                        {title}
                    </MetricCard.TextMuted>
                    <MetricCard.Icon style={{ flexShrink: 0, width: 56, height: 56 }}>
                        {icon}
                    </MetricCard.Icon>
                </Flex>

                <Stack gap={2} mt={-25}>
                    <MetricCard.TextEmphasis ff={'monospace'} truncate>
                        {value}
                    </MetricCard.TextEmphasis>
                    <MetricCard.TextTrend value={difference}>
                        {period ?? 'last month'}
                    </MetricCard.TextTrend>
                </Stack>
            </Stack>
        </MetricCard.Root>
    )
}
