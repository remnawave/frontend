import { Loader, Menu, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
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
            title: t('delete-user.feature.delete-user'),
            children: <Text size="sm">{t('delete-user.feature.are-you-sure')}</Text>,
            labels: {
                confirm: t('delete-user.feature.delete'),
                cancel: t('delete-user.feature.cancel')
            },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteUser()
        })

    return (
        <Menu.Item
            color="red.5"
            leftSection={
                isDeleteUserPending ? <Loader color="red" size={14} /> : <TbTrash size={14} />
            }
            onClick={openModal}
        >
            {t('delete-user.feature.delete-user')}
        </Menu.Item>
    )
}
