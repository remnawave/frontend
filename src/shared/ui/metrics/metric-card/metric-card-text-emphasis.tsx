import { ElementProps, Text, TextProps } from '@mantine/core'

import classes from './MetricCard.module.css'

type MetricCardTextEmphasis = ElementProps<'p', keyof TextProps> & Omit<TextProps, 'fw' | 'fz'>

export function MetricCardTextEmphasis({ className, ...props }: MetricCardTextEmphasis) {
    return <Text className={`${classes.textEmphasis} ${className || ''}`} {...props} />
}
