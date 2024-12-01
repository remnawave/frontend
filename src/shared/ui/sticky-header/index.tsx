import { useWindowScroll } from '@mantine/hooks'
import { Box, BoxProps } from '@mantine/core'
import { ReactNode } from 'react'
import clsx from 'clsx'

import classes from './sticky-header.module.css'

interface StickyHeaderProps extends BoxProps {
    children?: ReactNode
    offset?: number
}

export function StickyHeader({ children, offset = 2, className, ...rest }: StickyHeaderProps) {
    const [scroll] = useWindowScroll()

    return (
        <Box
            className={clsx(classes.root, className)}
            component="header"
            data-sticked={scroll.y > offset}
            {...rest}
        >
            {children}
        </Box>
    )
}
