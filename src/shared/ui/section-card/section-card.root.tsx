import { Card, CardProps, Divider, MantineSpacing, Stack } from '@mantine/core'
import { Children, ReactNode } from 'react'

interface ISectionCardRootProps extends Omit<CardProps, 'children'> {
    children: ReactNode
    dividerOpacity?: number
    gap?: MantineSpacing
}

export function SectionCardRoot({
    children,
    dividerOpacity = 0.3,
    gap = 'md',
    p = 'md',
    radius = 'md',
    style,
    ...props
}: ISectionCardRootProps) {
    const childArray = Children.toArray(children).filter(Boolean)

    const childrenWithDividers = childArray.reduce<ReactNode[]>((acc, child, index) => {
        acc.push(child)

        if (index < childArray.length - 1) {
            acc.push(<Divider key={`divider-${index}`} style={{ opacity: dividerOpacity }} />)
        }

        return acc
    }, [])

    return (
        <Card
            p={p}
            radius={radius}
            style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                ...style
            }}
            {...props}
        >
            <Stack gap={gap}>{childrenWithDividers}</Stack>
        </Card>
    )
}
