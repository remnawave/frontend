import { notifications } from '@mantine/notifications'
import { ActionIcon, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'
import { useState } from 'react'

import { useHostsStoreActions, useHostsStoreEditModalHost } from '@entitites/dashboard'

import { IProps } from './interfaces'

export function DeleteHostFeature(props: IProps) {
    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()

    const [isLoading, setIsLoading] = useState(false)

    if (!host) return null

    const handleDeleteHost = async () => {
        try {
            setIsLoading(true)
            await actions.deleteHost(host.uuid)

            notifications.show({
                title: 'Host deleted',
                message: 'Host has been deleted successfully',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete host',
                color: 'red'
            })
        } finally {
            setIsLoading(false)

            actions.toggleEditModal(false)
        }
    }

    return (
        <Tooltip label="Delete host">
            <ActionIcon color="red" loading={isLoading} onClick={handleDeleteHost} size="xl">
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
