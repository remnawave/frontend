import { ElementProps, Text, TextProps } from '@mantine/core'

type MetricCardTextEmphasis = Omit<TextProps, 'fz' | 'fw'> & ElementProps<'p', keyof TextProps>

export function MetricCardTextEmphasis(props: MetricCardTextEmphasis) {
    return <Text fz="h4" fw="bold" {...props} />
}
