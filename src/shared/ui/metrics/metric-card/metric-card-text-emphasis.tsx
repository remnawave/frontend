import { ElementProps, Text, TextProps } from '@mantine/core'

type MetricCardTextEmphasis = ElementProps<'p', keyof TextProps> & Omit<TextProps, 'fw' | 'fz'>

export function MetricCardTextEmphasis(props: MetricCardTextEmphasis) {
    return <Text fw="bold" fz="h4" {...props} />
}
