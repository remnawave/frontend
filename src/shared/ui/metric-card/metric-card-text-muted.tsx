import { ElementProps, Text, TextProps } from '@mantine/core'

export type MetricCardTextMutedProps = Omit<TextProps, 'c' | 'fz'> &
    ElementProps<'p', keyof TextProps>

export function MetricCardTextMuted(props: MetricCardTextMutedProps) {
    return <Text c="dimmed" fz="sm" {...props} />
}
