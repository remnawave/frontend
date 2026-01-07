import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { em, Modal } from '@mantine/core'
import { TbCpu } from 'react-icons/tb'
import { motion } from 'motion/react'

import { MODALS, useModalCloseActions, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { nodesQueryKeys, QueryKeys } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api'

import { EditNodeByUuidModalContent } from './edit-node-by-uuid-modal.content'

export const EditNodeByUuidModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState: nodeUuid } = useModalState(MODALS.EDIT_NODE_BY_UUID_MODAL)

    const [handleClose, clearInternalState] = useModalCloseActions(MODALS.EDIT_NODE_BY_UUID_MODAL)

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const clearInternalStateAndClose = () => {
        clearInternalState()

        if (nodeUuid) {
            queryClient.removeQueries({
                queryKey: nodesQueryKeys.getNode({ uuid: nodeUuid.nodeUuid }).queryKey
            })
        }

        queryClient.refetchQueries({
            queryKey: QueryKeys.nodes.getAllNodes.queryKey
        })
    }

    return (
        <Modal
            centered
            closeOnEscape={false}
            fullScreen={isMobile}
            onClose={handleClose}
            onExitTransitionEnd={clearInternalStateAndClose}
            opened={isOpen}
            size="1000px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbCpu}
                    iconVariant="gradient-teal"
                    title={t('edit-node-modal.widget.edit-node')}
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {!nodeUuid ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared h="78vh" />
                </motion.div>
            ) : (
                <EditNodeByUuidModalContent nodeUuid={nodeUuid.nodeUuid} onClose={handleClose} />
            )}
        </Modal>
    )
}
