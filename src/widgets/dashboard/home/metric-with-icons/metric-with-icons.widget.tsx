import { Box, Group, Stack } from '@mantine/core'

import { MetricCard } from '@shared/ui/metrics/metric-card'

import { MetricWithIconProps } from './interfaces/iprops'

export const MetricWithIcon = (props: MetricWithIconProps) => (
    <MetricCard.Root key={props.title}>
        <Group wrap="nowrap">
            <MetricCard.Icon c={props.color} p="sm">
                <props.icon size="32px" />
            </MetricCard.Icon>
            <Stack align="self-start" gap="xs" miw={0} w="100%">
                <MetricCard.TextMuted truncate>{props.title}</MetricCard.TextMuted>
                <Box miw={0} w={'100%'}>
                    <MetricCard.TextEmphasis ff={'monospace'} truncate>
                        {props.value}
                    </MetricCard.TextEmphasis>
                </Box>
            </Stack>
        </Group>
    </MetricCard.Root>
)
