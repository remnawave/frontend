import { Box, Card, Group, px, Stack, Text, ThemeIcon, ThemeIconProps } from '@mantine/core'
import { PiTrendDown, PiTrendUp } from 'react-icons/pi'

import { ShimmerSkeleton } from '@shared/ui/shimmer-skeleton'
import { formatPercentage, match } from '@shared/utils/misc'

import classes from './metric-card.module.css'

export interface IMetricCardWithTrendProps {
    difference: number | string
    IconComponent: React.ComponentType<{ size: number }>
    iconSize?: number
    iconVariant: ThemeIconProps['variant']
    isLoading?: boolean
    period?: string
    themeIconProps?: ThemeIconProps
    title: string
    value: number | string
}

const getTrendData = (difference: number | string) => {
    let color = ''
    let TrendIcon = PiTrendUp
    let valuePrinted: number | string = difference

    if (typeof difference === 'number') {
        const result = match(
            [
                difference > 0,
                {
                    sign: '+',
                    color: 'var(--mantine-color-teal-6)',
                    icon: PiTrendUp
                }
            ],
            [
                difference < 0,
                {
                    sign: '',
                    color: 'var(--mantine-color-red-6)',
                    icon: PiTrendDown
                }
            ]
        )
        color = result.color
        TrendIcon = result.icon
        valuePrinted = formatPercentage(difference, {
            prefix: result.sign,
            precision: 0,
            thousandSeparator: ' '
        })
    } else if (typeof difference === 'string') {
        if (difference.startsWith('-')) {
            color = 'var(--mantine-color-red-6)'
            TrendIcon = PiTrendDown
        } else {
            color = 'var(--mantine-color-teal-6)'
            TrendIcon = PiTrendUp
        }
        valuePrinted = difference
    }

    return { color, TrendIcon, valuePrinted }
}

export function MetricCardWithTrendShared(props: IMetricCardWithTrendProps) {
    const {
        themeIconProps,
        IconComponent,
        iconSize = 24,
        iconVariant,
        isLoading,
        title,
        value,
        difference,
        period
    } = props

    const { color, TrendIcon, valuePrinted } = getTrendData(difference)

    return (
        <Card>
            <Group gap="md" wrap="nowrap">
                <ThemeIcon radius="lg" size="xl" variant={iconVariant} {...themeIconProps}>
                    <IconComponent size={iconSize} />
                </ThemeIcon>

                <Stack gap={0} miw={0}>
                    <Text className={classes.title} truncate="end">
                        {title}
                    </Text>
                    {isLoading ? (
                        <ShimmerSkeleton height={24} width={80} />
                    ) : (
                        <Text className={classes.value} truncate="end">
                            {value}
                        </Text>
                    )}
                    <Box className={classes.trendContainer} component="div">
                        <TrendIcon color={color} size={px('0.85rem')} />
                        <Text className={classes.trendValue} component="span" style={{ color }}>
                            {valuePrinted}
                        </Text>
                        {period && <Text className={classes.trendText}>{period}</Text>}
                    </Box>
                </Stack>
            </Group>
        </Card>
    )
}
