import { useState } from 'react'

import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNodesStoreActions, useNodesStoreEditModalNode } from '@entitites/dashboard/nodes'
import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { IProps } from './interfaces'

export function ToggleNodeStatusButtonFeature(props: IProps) {
    const [isLoading, setIsLoading] = useState(false)
    const node = useNodesStoreEditModalNode()
    const actions = useNodesStoreActions()

    if (!node) return null

    let buttonLabel = ''
    let color = 'blue'
    let icon = <PiTrashDuotone size="1rem" />

    if (node.isDisabled) {
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
            if (node.isDisabled) {
                await actions.enableNode(node.uuid)
            } else {
                await actions.disableNode(node.uuid)
            }

            notifications.show({
                title: 'Success',
                message: 'Node status updated',
                color: 'green'
            })
        } catch (error) {
            console.error(error)
            notifications.show({
                title: 'Error',
                message: 'Failed to toggle node status',
                color: 'red'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            type="button"
            size="md"
            color={color}
            leftSection={icon}
            onClick={handleToggleUserStatus}
            loading={isLoading}
        >
            {buttonLabel}
        </Button>
    )
}