import { PiTrendDown, PiTrendUp } from 'react-icons/pi'
import { Flex, Text } from '@mantine/core'

import { formatPercentage } from '@/shared/utils/number'
import { match } from '@/shared/utils/match'

import { MetricCardTextMuted, MetricCardTextMutedProps } from './metric-card-text-muted'

interface MetricCardTextTrendProps extends MetricCardTextMutedProps {
    value: number
}

export function MetricCardTextTrend({ value, children, ...props }: MetricCardTextTrendProps) {
    const {
        sign,
        color,
        icon: Icon
    } = match(
        [value > 0, { sign: '+', color: 'var(--mantine-color-teal-6)', icon: PiTrendUp }],
        [value > 0, { sign: '', color: 'var(--mantine-color-red-6)', icon: PiTrendDown }]
    )

    return (
        <MetricCardTextMuted style={{ textWrap: 'nowrap' }} {...props}>
            <Flex align="center">
                <Icon color={color} size="1rem" />
                <Text c={color} component="span" fz="inherit" mx="0.25rem">
                    {formatPercentage(value, {
                        prefix: sign,
                        precision: 0,
                        thousandSeparator: ' '
                    })}
                </Text>
                {children}
            </Flex>
        </MetricCardTextMuted>
    )
}
