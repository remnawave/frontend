import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetUserById } from '@shared/api/hooks'
import { OPEN_ENTITY } from '@shared/constants'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { ViewUserModalContent } from './view-user.modal.content'

interface IProps {
    userId: number
}

export const ViewUserModal = NiceModal.create((props: IProps) => {
    const { userId } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        onClose: () => {
            queryClient.refetchQueries({
                queryKey: QueryKeys.users.getAllUsers._def
            })
            queryClient.refetchQueries({
                queryKey: QueryKeys.users.getUserTags.queryKey
            })
            queryClient.refetchQueries({
                queryKey: QueryKeys.system.getSystemStats.queryKey
            })
        }
    })

    const { data: user } = useGetUserById({
        route: { userId },
        query: { enabled: false }
    })

    return (
        <Modal
            {...modalProps}
            size="1000px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={IconUser}
                    iconVariant="soft"
                    openEntity={{ entity: OPEN_ENTITY.USER, id: userId }}
                    title={user?.username ?? t('view-user-modal.widget.edit-user-headline')}
                />
            }
        >
            <ViewUserModalContent userId={userId} />
        </Modal>
    )
})
