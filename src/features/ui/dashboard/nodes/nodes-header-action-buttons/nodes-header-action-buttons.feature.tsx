import { PiArrowsClockwise, PiPlus, PiSpiral } from 'react-icons/pi'
import { Button, Group } from '@mantine/core'

import { useNodesStoreActions } from '@entities/dashboard/nodes/nodes-store/nodes-store'
import { useGetNodes, useRestartAllNodes } from '@shared/api/hooks'

export const NodesHeaderActionButtonsFeature = () => {
    const actions = useNodesStoreActions()

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    const {
        isLoading: isGetNodesPending,
        refetch: refetchNodes,
        isPending,
        isRefetching
    } = useGetNodes()
    const { mutate: restartAllNodes, isPending: isRestartAllNodesPending } = useRestartAllNodes()

    return (
        <Group>
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isGetNodesPending || isPending || isRefetching}
                onClick={() => refetchNodes()}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button
                c="teal"
                leftSection={<PiSpiral size="1rem" />}
                loading={isRestartAllNodesPending}
                onClick={() => restartAllNodes({})}
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
                Create new node
            </Button>
        </Group>
    )
}
