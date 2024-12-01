import { notifications } from '@mantine/notifications'
import { ActionIcon, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'
import { useState } from 'react'

import { useNodesStoreActions, useNodesStoreEditModalNode } from '@entitites/dashboard/nodes'

import { IProps } from './interfaces'

export function DeleteNodeFeature(props: IProps) {
    const actions = useNodesStoreActions()
    const node = useNodesStoreEditModalNode()

    const [isLoading, setIsLoading] = useState(false)

    if (!node) return null

    const handleDeleteNode = async () => {
        try {
            setIsLoading(true)
            await actions.deleteNode(node.uuid)

            notifications.show({
                title: 'Node deleted',
                message: 'Node has been deleted successfully',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete node',
                color: 'red'
            })
        } finally {
            setIsLoading(false)

            actions.toggleEditModal(false)
        }
    }

    return (
        <Tooltip label="Delete node">
            <ActionIcon color="red" loading={isLoading} onClick={handleDeleteNode} size="xl">
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
