import { Group, Stack } from '@mantine/core'

import { MetricCard } from '@shared/ui/metrics/metric-card'

import { MetricWithIconProps } from './interfaces/iprops'

export const MetricWithIcon = (props: MetricWithIconProps) => (
    <MetricCard.Root key={props.title}>
        <Group>
            <MetricCard.Icon c={props.color} p="sm">
                <props.icon size="1.8rem" />
            </MetricCard.Icon>
            <Stack align="self-start" gap="xs">
                <MetricCard.TextMuted>{props.title}</MetricCard.TextMuted>
                <MetricCard.TextEmphasis ff={'monospace'}>{props.value}</MetricCard.TextEmphasis>
            </Stack>
        </Group>
    </MetricCard.Root>
)
