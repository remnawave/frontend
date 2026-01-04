import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { IconUser } from '@tabler/icons-react'
import { em, Modal } from '@mantine/core'
import { motion } from 'motion/react'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { usersQueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { ViewUserModalContent } from './view-user-modal.content'

export const ViewUserModal = () => {
    const { t } = useTranslation()

    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()
    const selectedUser = useUserModalStoreUserUuid()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const handleClose = () => {
        bulkUsersActionsStoreActions.resetState()
        actions.clearModalState()

        if (selectedUser) {
            queryClient.removeQueries({
                queryKey: usersQueryKeys.getUserByUuid({
                    uuid: selectedUser
                }).queryKey
            })
        }
    }

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={() => actions.changeModalState(false)}
            onExitTransitionEnd={handleClose}
            opened={isViewUserModalOpen}
            size="1000px"
            title={
                <BaseOverlayHeader
                    IconComponent={IconUser}
                    iconVariant="gradient-cyan"
                    title={t('view-user-modal.widget.edit-user-headline')}
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {!selectedUser ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared
                        h="78vh"
                        text={t('view-user-modal.widget.fetching-user-data')}
                    />
                </motion.div>
            ) : (
                <ViewUserModalContent userUuid={selectedUser} />
            )}
        </Modal>
    )
}
