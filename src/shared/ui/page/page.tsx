import { forwardRef, ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { nprogress } from '@mantine/nprogress'
import { Box, BoxProps } from '@mantine/core'

import { app } from 'src/config'

interface PageProps extends BoxProps {
    children: ReactNode
    meta?: ReactNode
    title: string
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
    ({ children, title = '', meta, ...other }, ref) => {
        // const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({
        //     offset: 0
        // })

        useEffect(() => {
            nprogress.complete()
            return () => nprogress.start()
        }, [])

        // useEffect(() => {
        //     scrollIntoView()
        // }, [])

        return (
            <>
                <title>{`${title} | ${app.name}`}</title>
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
