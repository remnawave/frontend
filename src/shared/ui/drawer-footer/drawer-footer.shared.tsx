import { Box, Group } from '@mantine/core'
import { ReactNode } from 'react'

import { useIsMobile } from '@shared/hooks'

import styles from './DrawerFooter.module.css'

interface IProps {
    children: ReactNode
}

export function DrawerFooter(props: IProps) {
    const { children } = props
    const isMobile = useIsMobile()

    return (
        <Box className={styles.footer} component="footer">
            <Group
                gap="md"
                grow={!!isMobile}
                justify="flex-end"
                preventGrowOverflow={false}
                w="100%"
                wrap="wrap"
            >
                {children}
            </Group>
        </Box>
    )
}
