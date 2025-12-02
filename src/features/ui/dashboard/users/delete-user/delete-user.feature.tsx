import { useTranslation } from 'react-i18next'
import { Loader, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { TbTrash } from 'react-icons/tb'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store/user-modal-store'
import { useDeleteUser } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function DeleteUserFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const actions = useUserModalStoreActions()

    const { mutate: deleteUser, isPending: isDeleteUserPending } = useDeleteUser({
        mutationFns: {
            onSuccess: () => {
                actions.changeModalState(false)
            }
        }
    })

    const handleDeleteUser = () => {
        deleteUser({
            route: {
                uuid: userUuid ?? ''
            }
        })
    }

    const openModal = () =>
        modals.openConfirmModal({
            title: t('common.delete'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteUser()
        })

    return (
        <Menu.Item
            color="red.5"
            leftSection={
                isDeleteUserPending ? <Loader color="red" size={16} /> : <TbTrash size={16} />
            }
            onClick={openModal}
        >
            {t('common.delete')}
        </Menu.Item>
    )
}
