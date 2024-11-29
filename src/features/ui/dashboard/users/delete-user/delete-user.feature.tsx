import { useState } from 'react'

import { ActionIcon, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { PiTrashDuotone } from 'react-icons/pi'
import {
    useUserModalStore,
    useUserModalStoreUser
} from '@/entitites/dashboard/user-modal-store/user-modal-store'
import { IProps } from './interfaces'

export function DeleteUserFeature(props: IProps) {
    const { actions } = useUserModalStore()
    const user = useUserModalStoreUser()
    const [isLoading, setIsLoading] = useState(false)

    if (!user) return null

    const handleDeleteUser = async () => {
        try {
            setIsLoading(true)
            await actions.deleteUser()

            notifications.show({
                title: 'User deleted',
                message: 'User has been deleted successfully',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete user',
                color: 'red'
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Tooltip label="Delete user">
            <ActionIcon size="xl" color="red" onClick={handleDeleteUser} loading={isLoading}>
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}