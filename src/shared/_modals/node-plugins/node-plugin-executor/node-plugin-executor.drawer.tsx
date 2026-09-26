import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { motion } from 'motion/react'
import { TbTerminal } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetNodes } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { NodePluginExecutorContent } from './node-plugin-executor.content'

export const NodePluginExecutorDrawer = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { data: nodes, isLoading } = useGetNodes()

    return (
        <Modal
            {...modalProps}
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbTerminal}
                    iconVariant="soft"
                    title="Executor"
                />
            }
        >
            {isLoading || !nodes ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared mih="50vh" />
                </motion.div>
            ) : (
                <NodePluginExecutorContent nodes={nodes} onClose={hide} />
            )}
        </Modal>
    )
})
