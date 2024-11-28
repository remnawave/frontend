import { Card, CardProps } from '@mantine/core'

type DataTableContainerProps = CardProps

export function DataTableContainer({ children, ...props }: DataTableContainerProps) {
    return <Card {...props}>{children}</Card>
}
