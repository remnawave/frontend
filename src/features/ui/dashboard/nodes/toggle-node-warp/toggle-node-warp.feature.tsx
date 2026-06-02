import { PiCloudCheckDuotone, PiCloudSlashDuotone } from 'react-icons/pi'
import { ActionIcon, Loader, Tooltip } from '@mantine/core'
import { memo } from 'react'

import {
    nodesQueryKeys,
    QueryKeys,
    TNodeWithWarp,
    getNodeWarpStatus,
    getNodeWarpUiState,
    useDisableNodeWarp,
    useEnableNodeWarp
} from '@shared/api/hooks'
import { queryClient } from '@shared/api'

interface IProps {
    node: TNodeWithWarp
}

export const ToggleNodeWarpFeature = memo(({ node }: IProps) => {
    const warp = getNodeWarpStatus(node)
    const state = getNodeWarpUiState(warp)
    const isDisabled = node.isDisabled || !node.isConnected

    const mutationParams = {
        route: {
            uuid: node.uuid
        },
        mutationFns: {
            onSuccess: async (updatedNode: TNodeWithWarp) => {
                queryClient.setQueryData(
                    QueryKeys.nodes.getNode({ uuid: updatedNode.uuid }).queryKey,
                    updatedNode
                )
                queryClient.setQueryData<TNodeWithWarp[] | undefined>(
                    nodesQueryKeys.getAllNodes.queryKey,
                    (nodes) =>
                        nodes?.map((item) => (item.uuid === updatedNode.uuid ? updatedNode : item))
                )
            }
        }
    }

    const { mutate: enableWarp, isPending: isEnablePending } = useEnableNodeWarp(mutationParams)
    const { mutate: disableWarp, isPending: isDisablePending } = useDisableNodeWarp(mutationParams)
    const isPending = isEnablePending || isDisablePending

    const handleToggleWarp = () => {
        if (state.isRunning) {
            disableWarp({})
            return
        }

        enableWarp({})
    }

    return (
        <Tooltip label={state.isRunning ? 'Disable WARP' : 'Enable WARP'}>
            <ActionIcon
                color={state.isRunning ? 'teal' : 'gray'}
                disabled={isDisabled || isPending}
                onClick={handleToggleWarp}
                size="md"
                variant="light"
            >
                {isPending ? (
                    <Loader color={state.isRunning ? 'teal' : 'gray'} size="xs" />
                ) : state.isRunning ? (
                    <PiCloudCheckDuotone size={16} />
                ) : (
                    <PiCloudSlashDuotone size={16} />
                )}
            </ActionIcon>
        </Tooltip>
    )
})
