import { useState } from 'react'

import { Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNodesStoreActions } from '@entitites/dashboard/nodes/nodes-store/nodes-store'
import { PiArrowsClockwise, PiPlus, PiSpiral } from 'react-icons/pi'
import { IProps } from './interfaces'

export const NodesHeaderActionButtonsFeature = (props: IProps) => {
    const actions = useNodesStoreActions()

    const [isLoading, setIsLoading] = useState(false)
    const [isRestartLoading, setIsRestartLoading] = useState(false)

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

    const handleRestart = () => {
        try {
            setIsRestartLoading(true)
            actions.restartAllNodes()

            notifications.show({
                title: 'Success',
                message: 'Please wait while nodes will reconnect',
                color: 'teal'
            })
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                setIsRestartLoading(false)
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
                c="teal"
                leftSection={<PiSpiral size="1rem" />}
                onClick={handleRestart}
                loading={isRestartLoading}
            >
                Restart all nodes
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
