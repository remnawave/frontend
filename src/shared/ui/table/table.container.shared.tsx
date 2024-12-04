import { Card, CardProps } from '@mantine/core'

type TableContainerSharedProps = CardProps

export function TableContainerShared({ children, ...props }: TableContainerSharedProps) {
    return <Card {...props}>{children}</Card>
}
