import { PiCloudCheckDuotone, PiCloudSlashDuotone } from 'react-icons/pi'
import { ActionIcon, Group, Loader, Tooltip } from '@mantine/core'
import { TbDownload, TbTrash } from 'react-icons/tb'
import { memo } from 'react'

import {
    getNodeWarpStatus,
    getNodeWarpUiState,
    isNodeWarpOperationPending,
    nodesQueryKeys,
    QueryKeys,
    TNodeWithWarp,
    useDisableNodeWarp,
    useEnableNodeWarp,
    useGetNodeWarpStatus,
    useInstallNodeWarp,
    useUninstallNodeWarp
} from '@shared/api/hooks'
import { queryClient } from '@shared/api'

interface IProps {
    node: TNodeWithWarp
}

export const ToggleNodeWarpFeature = memo(({ node }: IProps) => {
    const warp = getNodeWarpStatus(node)
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

                const updatedWarp = getNodeWarpStatus(updatedNode)
                if (updatedWarp) {
                    queryClient.setQueryData(
                        nodesQueryKeys.getNodeWarpStatus({ uuid: updatedNode.uuid }).queryKey,
                        updatedWarp
                    )
                }
            }
        }
    }

    const { mutate: installWarp, isPending: isInstallPending } = useInstallNodeWarp(mutationParams)
    const { mutate: enableWarp, isPending: isEnablePending } = useEnableNodeWarp(mutationParams)
    const { mutate: disableWarp, isPending: isDisablePending } = useDisableNodeWarp(mutationParams)
    const { mutate: uninstallWarp, isPending: isUninstallPending } =
        useUninstallNodeWarp(mutationParams)

    const isPending =
        isInstallPending || isEnablePending || isDisablePending || isUninstallPending

    const statusQuery = useGetNodeWarpStatus({
        route: {
            uuid: node.uuid
        },
        rQueryParams: {
            enabled: !isDisabled && (isPending || isNodeWarpOperationPending(warp))
        }
    })

    const effectiveWarp = statusQuery.data ?? warp
    const state = getNodeWarpUiState(effectiveWarp)
    const operationPending = isNodeWarpOperationPending(effectiveWarp)
    const buttonsDisabled = isDisabled || isPending || operationPending

    const renderIcon = (isActionPending: boolean, icon: React.ReactNode) => {
        if (isActionPending) {
            return <Loader color={state.isRunning ? 'teal' : 'gray'} size="xs" />
        }

        return icon
    }

    return (
        <Group gap={4} wrap="nowrap">
            <Tooltip label="Install WARP">
                <ActionIcon
                    aria-label="Install WARP"
                    color="blue"
                    disabled={buttonsDisabled}
                    onClick={() => installWarp({})}
                    size="md"
                    variant="light"
                >
                    {renderIcon(isInstallPending, <TbDownload size={16} />)}
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Enable WARP">
                <ActionIcon
                    aria-label="Enable WARP"
                    color={state.isRunning ? 'teal' : 'gray'}
                    disabled={buttonsDisabled || state.isRunning}
                    onClick={() => enableWarp({})}
                    size="md"
                    variant="light"
                >
                    {renderIcon(isEnablePending, <PiCloudCheckDuotone size={16} />)}
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Disable WARP">
                <ActionIcon
                    aria-label="Disable WARP"
                    color="gray"
                    disabled={buttonsDisabled || !effectiveWarp?.running}
                    onClick={() => disableWarp({})}
                    size="md"
                    variant="light"
                >
                    {renderIcon(isDisablePending, <PiCloudSlashDuotone size={16} />)}
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Uninstall WARP">
                <ActionIcon
                    aria-label="Uninstall WARP"
                    color="red"
                    disabled={buttonsDisabled || !effectiveWarp?.installed}
                    onClick={() => uninstallWarp({})}
                    size="md"
                    variant="light"
                >
                    {renderIcon(isUninstallPending, <TbTrash size={16} />)}
                </ActionIcon>
            </Tooltip>
        </Group>
    )
})
