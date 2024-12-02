import { PiArrowsClockwise, PiPlus, PiSpiral } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { Button, Group } from '@mantine/core'
import { useState } from 'react'

import { useNodesStoreActions } from '@entitites/dashboard/nodes/nodes-store/nodes-store'

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
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isLoading}
                onClick={handleUpdate}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button
                c="teal"
                leftSection={<PiSpiral size="1rem" />}
                loading={isRestartLoading}
                onClick={handleRestart}
                size="xs"
                variant="default"
            >
                Restart all nodes
            </Button>

            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
                size="xs"
                variant="default"
            >
                Create new host
            </Button>
        </Group>
    )
}
