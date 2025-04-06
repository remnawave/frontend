import { Card, CardProps, ElementProps } from '@mantine/core'

type MetricCardRootProps = CardProps & ElementProps<'div', keyof CardProps>

export function MetricCardRoot({ ...props }: MetricCardRootProps) {
    return <Card p="md" radius="md" shadow="sm" withBorder {...props} />
}
