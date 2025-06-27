import { ElementProps, Text, TextProps } from '@mantine/core'

import classes from './MetricCard.module.css'

export type MetricCardTextMutedProps = ElementProps<'p', keyof TextProps> &
    Omit<TextProps, 'c' | 'fz'>

export function MetricCardTextMuted({ className, ...props }: MetricCardTextMutedProps) {
    return <Text className={`${classes.textMuted} ${className || ''}`} {...props} />
}
