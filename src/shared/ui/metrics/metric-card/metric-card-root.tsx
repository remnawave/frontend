import { Card, CardProps, ElementProps } from '@mantine/core'

import classes from './MetricCard.module.css'

type MetricCardRootProps = CardProps & ElementProps<'div', keyof CardProps>

export function MetricCardRoot({ className, ...props }: MetricCardRootProps) {
    return <Card className={`${classes.root} ${className || ''}`} withBorder {...props} />
}
