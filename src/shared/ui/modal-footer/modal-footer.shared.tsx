import { em, Group, Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import styles from './ModalFooter.module.css'

interface IProps {
    children: React.ReactNode
}

export function ModalFooter(props: IProps) {
    const { children } = props
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

    return (
        <Modal.Header
            bottom={10}
            className={styles.modalFooter}
            component="footer"
            h="auto"
            mt="md"
            pos="sticky"
        >
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
        </Modal.Header>
    )
}
