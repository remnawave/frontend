import { Box, BoxProps } from '@mantine/core'
import { ReactNode, Ref } from 'react'

interface ISectionCardSectionProps extends BoxProps {
    children: ReactNode
    ref?: Ref<HTMLDivElement>
}

export function SectionCardSection({ children, ...props }: ISectionCardSectionProps) {
    return <Box {...props}>{children}</Box>
}
