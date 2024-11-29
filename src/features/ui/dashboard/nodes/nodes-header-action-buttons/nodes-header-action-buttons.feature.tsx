import { useState } from 'react'

import { Button, Group } from '@mantine/core'
import { useNodesStoreActions } from '@entitites/dashboard/nodes/nodes-store/nodes-store'
import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { IProps } from './interfaces'

export const NodesHeaderActionButtonsFeature = (props: IProps) => {
    const actions = useNodesStoreActions()

    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    const handleUpdate = () => {
        try {
            setIsLoading(true)
            actions.getNodes()
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    return (
        <Group>
            <Button
                variant="default"
                size="xs"
                leftSection={<PiArrowsClockwise size="1rem" />}
                onClick={handleUpdate}
                loading={isLoading}
            >
                Update
            </Button>

            <Button
                variant="default"
                size="xs"
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
            >
                Create new host
            </Button>
        </Group>
    )
}
