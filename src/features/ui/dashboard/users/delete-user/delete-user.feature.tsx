import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

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
        <Tooltip label={t('delete-user.feature.delete-user')}>
            <ActionIcon color="red.5" loading={isDeleteUserPending} onClick={openModal} size="xl">
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
