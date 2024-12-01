import { Group } from '@mantine/core'

import { MetricCard } from '@/shared/ui/metrics/metric-card'

import { MetricWithIconProps } from './interfaces/iprops'

export const MetricWithIcon = (props: MetricWithIconProps) => (
    <MetricCard.Root key={props.title}>
        <Group>
            <MetricCard.Icon c={props.color}>
                <props.icon size="2rem" />
            </MetricCard.Icon>
            <div>
                <MetricCard.TextMuted>{props.title}</MetricCard.TextMuted>
                <MetricCard.TextEmphasis ff={'monospace'}>{props.value}</MetricCard.TextEmphasis>
            </div>
        </Group>
    </MetricCard.Root>
)
