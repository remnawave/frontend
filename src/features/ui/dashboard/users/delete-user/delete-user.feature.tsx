import { ActionIcon, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'

import { useUserModalStoreActions } from '@/entitites/dashboard/user-modal-store/user-modal-store'
import { useDeleteUser } from '@/shared/api/hooks'

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

    return (
        <Tooltip label="Delete user">
            <ActionIcon
                color="red"
                loading={isDeleteUserPending}
                onClick={handleDeleteUser}
                size="xl"
            >
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
