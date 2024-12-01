import { forwardRef, ReactNode, useEffect } from 'react'
import { nprogress } from '@mantine/nprogress'
import { Box, BoxProps } from '@mantine/core'

import { app } from '@/config'

interface PageProps extends BoxProps {
    children: ReactNode
    meta?: ReactNode
    title: string
}
export const Page = forwardRef<HTMLDivElement, PageProps>(
    ({ children, title = '', meta, ...other }, ref) => {
        useEffect(() => {
            nprogress.complete()
            return () => nprogress.start()
        }, [])

        return (
            <>
                <title>{`${title} | ${app.name}`}</title>
                {meta}

                <Box ref={ref} {...other}>
                    {children}
                </Box>
            </>
        )
    }
)
