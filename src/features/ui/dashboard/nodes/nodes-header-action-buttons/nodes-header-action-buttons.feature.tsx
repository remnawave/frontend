import {
    TbAlertCircle,
    TbCards,
    TbPlus,
    TbRefresh,
    TbRocket,
    TbSearch,
    TbTable
} from 'react-icons/tb'
import { ActionIcon, ActionIconGroup, Group, Stack, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { spotlight } from '@mantine/spotlight'
import { PiSpiral } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { useNodesStoreActions } from '@entities/dashboard/nodes/nodes-store/nodes-store'
import { NodesViewMode } from '@pages/dashboard/nodes/ui/components/interfaces'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetNodes, useRestartAllNodes } from '@shared/api/hooks'
import { ActionCardShared } from '@shared/ui'

interface IProps {
    setViewMode: (viewMode: NodesViewMode) => void
    viewMode: NodesViewMode
}

export const NodesHeaderActionButtonsFeature = (props: IProps) => {
    const { setViewMode, viewMode } = props

    const { t } = useTranslation()

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

    const openRestartAllNodesModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    IconComponent={TbRocket}
                    iconVariant="gradient-teal"
                    title={t('nodes-header-action-buttons.feature.restart-all-nodes')}
                />
            ),
            centered: true,
            size: 'md',
            children: (
                <Stack gap="sm">
                    <ActionCardShared
                        description={t(
                            'nodes-header-action-buttons.feature.force-restart-description'
                        )}
                        icon={<TbAlertCircle size={22} />}
                        isLoading={isPending}
                        onClick={() => {
                            restartAllNodes({
                                variables: {
                                    forceRestart: true
                                }
                            })
                            modals.closeAll()
                        }}
                        title={t('nodes-header-action-buttons.feature.force')}
                        variant="gradient-red"
                    />

                    <ActionCardShared
                        description={t(
                            'nodes-header-action-buttons.feature.graceful-restart-description-1'
                        )}
                        icon={<TbRocket size={22} />}
                        isLoading={isPending}
                        onClick={() => {
                            restartAllNodes({
                                variables: {
                                    forceRestart: false
                                }
                            })
                            modals.closeAll()
                        }}
                        title={t('nodes-header-action-buttons.feature.graceful')}
                        variant="gradient-teal"
                    />
                </Stack>
            )
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            {viewMode === NodesViewMode.CARDS && (
                <ActionIconGroup>
                    <Tooltip label={t('nodes-header-action-buttons.feature.search-nodes')}>
                        <ActionIcon
                            color="gray"
                            onClick={spotlight.open}
                            size="input-md"
                            variant="light"
                        >
                            <TbSearch size="24px" />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>
            )}

            <ActionIconGroup>
                <Tooltip label="Toggle view mode">
                    <ActionIcon
                        color="gray"
                        onClick={() =>
                            setViewMode(
                                viewMode === NodesViewMode.TABLE
                                    ? NodesViewMode.CARDS
                                    : NodesViewMode.TABLE
                            )
                        }
                        size="input-md"
                        variant="light"
                    >
                        {viewMode === NodesViewMode.CARDS ? (
                            <TbTable size="24px" />
                        ) : (
                            <TbCards size="24px" />
                        )}
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
            <ActionIconGroup>
                <Tooltip
                    label={t('nodes-header-action-buttons.feature.restart-all-nodes')}
                    withArrow
                >
                    <ActionIcon
                        color="grape"
                        loading={isRestartAllNodesPending}
                        onClick={() => {
                            openRestartAllNodesModal()
                        }}
                        size="input-md"
                        variant="light"
                    >
                        <PiSpiral size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isGetNodesPending || isPending || isRefetching}
                        onClick={() => refetchNodes()}
                        size="input-md"
                        variant="light"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
            <ActionIconGroup>
                <Tooltip label={t('nodes-header-action-buttons.feature.create-new-node')} withArrow>
                    <ActionIcon color="teal" onClick={handleCreate} size="input-md" variant="light">
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
