import { Box, BoxProps } from '@mantine/core'
import { ReactNode } from 'react'

interface ISectionCardSectionProps extends BoxProps {
    children: ReactNode
}

export function SectionCardSection({ children, ...props }: ISectionCardSectionProps) {
    return <Box {...props}>{children}</Box>
}
