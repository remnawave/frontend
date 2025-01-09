import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store/user-modal-store'
import { useDeleteUser } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function DeleteUserFeature(props: IProps) {
    const { userUuid } = props
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
            title: 'Delete user',
            children: (
                <Text size="sm">
                    Are you sure you want to delete the user? This action is irreversible.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteUser()
        })

    return (
        <Tooltip label="Delete user">
            <ActionIcon color="red" loading={isDeleteUserPending} onClick={openModal} size="xl">
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
