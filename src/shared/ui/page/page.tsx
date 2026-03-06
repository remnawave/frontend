import { forwardRef, ReactNode, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { nprogress } from '@mantine/nprogress'
import { Box, BoxProps } from '@mantine/core'

import { useGetAuthStatus } from '@shared/api/hooks'
import { app } from 'src/config'

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

        const { data: authStatus } = useGetAuthStatus()

        const pageTitle = useMemo(() => {
            return `${title} | ${authStatus?.branding.title || app.name}`
        }, [title, authStatus?.branding.title])

        return (
            <>
                <title>{pageTitle}</title>
                {meta}

                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut'
                        }}
                    >
                        <Box ref={ref} {...other}>
                            {children}
                        </Box>
                    </motion.div>
                </AnimatePresence>
            </>
        )
    }
)
