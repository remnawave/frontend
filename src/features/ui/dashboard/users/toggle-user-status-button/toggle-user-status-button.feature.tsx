import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { USERS_STATUS } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { Button } from '@mantine/core'
import { useState } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreUser
} from '@/entitites/dashboard/user-modal-store/user-modal-store'

import { IProps } from './interfaces'

export function ToggleUserStatusButtonFeature(props: IProps) {
    const [isLoading, setIsLoading] = useState(false)
    const user = useUserModalStoreUser()
    const actions = useUserModalStoreActions()

    if (!user) return null

    let buttonLabel = ''
    let color = 'blue'
    let icon = <PiTrashDuotone size="1rem" />

    if (user.status === USERS_STATUS.DISABLED) {
        color = 'green'
        buttonLabel = 'Enable'
        icon = <PiCellSignalFullDuotone size="1rem" />
    } else {
        color = 'red'
        buttonLabel = 'Disable'
        icon = <PiCellSignalSlashDuotone size="1rem" />
    }

    const handleToggleUserStatus = async () => {
        setIsLoading(true)
        try {
            if (user.status !== USERS_STATUS.DISABLED) {
                await actions.disableUser()
            } else {
                await actions.enableUser()
            }

            notifications.show({
                title: 'Success',
                message: 'User status updated',
                color: 'green'
            })
        } catch (error) {
            console.error(error)
            notifications.show({
                title: 'Error',
                message: 'Failed to toggle user status',
                color: 'red'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            color={color}
            leftSection={icon}
            loading={isLoading}
            onClick={handleToggleUserStatus}
            size="md"
            type="button"
        >
            {buttonLabel} user
        </Button>
    )
}
