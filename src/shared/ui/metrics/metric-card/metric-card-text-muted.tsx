import { ElementProps, Text, TextProps } from '@mantine/core'

export type MetricCardTextMutedProps = ElementProps<'p', keyof TextProps> &
    Omit<TextProps, 'c' | 'fz'>

export function MetricCardTextMuted(props: MetricCardTextMutedProps) {
    return <Text c="dimmed" fz="sm" {...props} />
}
