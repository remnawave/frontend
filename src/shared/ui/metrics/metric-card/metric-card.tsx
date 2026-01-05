import { Card, Group, Stack, Text, ThemeIcon, ThemeIconProps } from '@mantine/core'

import { ShimmerSkeleton } from '@shared/ui/shimmer-skeleton'
import { formatInt } from '@shared/utils/misc'

import classes from './metric-card.module.css'

export interface IMetricCardProps {
    IconComponent: React.ComponentType<{ size: number }>
    iconSize?: number
    iconVariant: ThemeIconProps['variant']
    isLoading?: boolean
    subtitle?: string
    themeIconProps?: ThemeIconProps
    title: string
    value: number | string
}

export function MetricCardShared(props: IMetricCardProps) {
    const {
        themeIconProps,
        IconComponent,
        iconSize = 24,
        iconVariant,
        isLoading,
        title,
        value,
        subtitle
    } = props

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
                            {typeof value === 'number' ? formatInt(value) : value}
                        </Text>
                    )}
                    {subtitle && <Text className={classes.subtitle}>{subtitle}</Text>}
                </Stack>
            </Group>
        </Card>
    )
}
