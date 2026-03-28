import { Group, Modal } from '@mantine/core'

import styles from './ModalFooter.module.css'

interface IProps {
    children: React.ReactNode
    isMobile?: boolean
}

export function ModalFooter(props: IProps) {
    const { children, isMobile = false } = props

    return (
        <Modal.Header className={styles.footer} component="footer" h="auto" mt="md" pos="sticky">
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
