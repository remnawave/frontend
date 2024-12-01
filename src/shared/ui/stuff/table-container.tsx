import { Card, CardProps } from '@mantine/core'
import { ReactNode } from 'react'

import { CardTitle } from './card-title'

interface TableContainerProps extends CardProps {
    actions?: ReactNode
    description?: string
    title?: string
}

export function TableContainer({
    children,
    title,
    description,
    actions,
    ...props
}: TableContainerProps) {
    return (
        <Card {...props}>
            {title && (
                <CardTitle actions={actions} description={description} title={title} withBorder />
            )}
            <Card.Section>{children}</Card.Section>
        </Card>
    )
}
