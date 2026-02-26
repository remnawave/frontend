import { useMediaQuery } from '@mantine/hooks'
import { TbTerminal } from 'react-icons/tb'
import { em, Modal } from '@mantine/core'
import { motion } from 'motion/react'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { useGetNodes } from '@shared/api/hooks'

import { NodePluginExecutorContent } from './node-plugin-executor.content'

export const NodePluginExecutorDrawer = () => {
    const { isOpen } = useModalState(MODALS.NODE_PLUGIN_EXECUTOR_DRAWER)
    const close = useModalClose(MODALS.NODE_PLUGIN_EXECUTOR_DRAWER)

    const { data: nodes, isLoading } = useGetNodes()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={close}
            opened={isOpen}
            size="800px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbTerminal}
                    iconVariant="gradient-cyan"
                    title="Executor"
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {isLoading || !nodes ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared h="78vh" />
                </motion.div>
            ) : (
                <NodePluginExecutorContent nodes={nodes} onClose={close} />
            )}
        </Modal>
    )
}
