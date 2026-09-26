import { motion } from 'motion/react'

import classes from '../NodeSshTerminal.module.css'

interface IProps {
    children: React.ReactNode
    fitHeight?: boolean
    maxWidth?: number
    onDismiss?: () => void
}

export const TerminalOverlay = (props: IProps) => {
    const { children, fitHeight = false, maxWidth = 520, onDismiss } = props

    return (
        <motion.div
            animate={{ opacity: 1 }}
            className={classes.overlay}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onDismiss?.()
            }}
            transition={{ duration: 0.16 }}
        >
            <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 4 }}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                style={{
                    maxWidth,
                    width: '100%',
                    ...(fitHeight && {
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        minHeight: 0
                    })
                }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
