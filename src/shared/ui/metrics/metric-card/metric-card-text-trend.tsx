import { PiTrendDown, PiTrendUp } from 'react-icons/pi'
import { px, Text } from '@mantine/core'

import { formatPercentage, match } from '@shared/utils/misc'

import classes from './MetricCard.module.css'

interface MetricCardTextTrendProps {
    children: React.ReactNode
    value: number | string
}

export function MetricCardTextTrend({ value, children }: MetricCardTextTrendProps) {
    let sign = ''
    let color = ''
    let Icon = PiTrendUp
    let valuePrinted = value
    let isPositive = true

    if (typeof value === 'number') {
        const result = match(
            [
                Number(value) > 0,
                {
                    sign: '+',
                    color: 'var(--mantine-color-teal-6)',
                    icon: PiTrendUp,
                    positive: true
                }
            ],
            [
                Number(value) < 0,
                {
                    sign: '',
                    color: 'var(--mantine-color-red-6)',
                    icon: PiTrendDown,
                    positive: false
                }
            ]
        )
        sign = result.sign
        color = result.color
        Icon = result.icon
        isPositive = result.positive
        valuePrinted = formatPercentage(value, {
            prefix: sign,
            precision: 0,
            thousandSeparator: ' '
        })
    } else if (typeof value === 'string') {
        if (value.startsWith('-')) {
            color = 'var(--mantine-color-red-6)'
            Icon = PiTrendDown
            isPositive = false
            sign = ''
        } else {
            color = 'var(--mantine-color-teal-6)'
            Icon = PiTrendUp
            isPositive = true
            sign = '+'
        }
        valuePrinted = value
    }

    const containerClass = `${classes.trendContainer} ${isPositive ? classes.trendPositive : classes.trendNegative}`

    return (
        <div className={containerClass}>
            <Icon color={color} size={px('0.9rem')} />
            <Text className={classes.trendValue} component="span" style={{ color }}>
                {valuePrinted}
            </Text>
            <Text className={classes.trendText}>{children}</Text>
        </div>
    )
}
