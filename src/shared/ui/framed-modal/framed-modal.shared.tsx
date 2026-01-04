import { Box, em, Group, Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ReactNode } from 'react'

import styles from './framed-modal.module.css'

type ModalRootProps = React.ComponentProps<typeof Modal.Root>

interface IFramedModalProps extends ModalRootProps {
    children: ReactNode
    footer?: ReactNode
    title?: ReactNode
}

export function FramedModal({ children, footer, title, onClose, ...props }: IFramedModalProps) {
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return (
        <Modal.Root onClose={onClose} {...props}>
            <Modal.Overlay />
            <Modal.Content>
                {title && (
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                )}
                <Modal.Body p={isMobile ? 'xs' : undefined}>{children}</Modal.Body>
                {footer && (
                    <Box className={styles.footer} component="footer">
                        <Group
                            gap="md"
                            grow={!!isMobile}
                            justify="flex-end"
                            preventGrowOverflow={false}
                            w="100%"
                            wrap="wrap"
                        >
                            {footer}
                        </Group>
                    </Box>
                )}
            </Modal.Content>
        </Modal.Root>
    )
}
