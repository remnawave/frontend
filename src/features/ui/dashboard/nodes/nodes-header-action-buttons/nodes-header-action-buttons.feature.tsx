import { ActionIcon, ActionIconGroup, Group, Stack, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { spotlight } from '@mantine/spotlight'
import { useTranslation } from 'react-i18next'
import { PiSpiral } from 'react-icons/pi'
import {
    TbAlertCircle,
    TbCards,
    TbPlus,
    TbPlugConnected,
    TbRefresh,
    TbRocket,
    TbSearch,
    TbTable
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useGetNodes, useRestartAllNodes } from '@shared/api/hooks'
import { ActionCardShared } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { NODES_VIEW_MODE, useExperimentalFeature } from '@entities/dashboard/view-preferences-store'

interface IProps {
    setViewMode: (viewMode: NODES_VIEW_MODE) => void
    viewMode: NODES_VIEW_MODE
}

export const NodesHeaderActionButtonsFeature = (props: IProps) => {
    const { setViewMode, viewMode } = props

    const { t } = useTranslation()

    const isNodeIntegrationsEnabled = useExperimentalFeature('nodeIntegrations')

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
                    iconColor="teal"
                    IconComponent={TbRocket}
                    iconVariant="soft"
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
                        iconColor="red"
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
                        variant="soft"
                    />

                    <ActionCardShared
                        description={t(
                            'nodes-header-action-buttons.feature.graceful-restart-description-1'
                        )}
                        icon={<TbRocket size={22} />}
                        iconColor="teal"
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
                        variant="soft"
                    />
                </Stack>
            )
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            {viewMode === NODES_VIEW_MODE.CARDS && (
                <ActionIconGroup>
                    <Tooltip label={t('nodes-header-action-buttons.feature.search-nodes')}>
                        <ActionIcon
                            color="gray"
                            onClick={spotlight.open}
                            size="input-md"
                            variant="soft"
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
                                viewMode === NODES_VIEW_MODE.TABLE
                                    ? NODES_VIEW_MODE.CARDS
                                    : NODES_VIEW_MODE.TABLE
                            )
                        }
                        size="input-md"
                        variant="soft"
                    >
                        {viewMode === NODES_VIEW_MODE.CARDS ? (
                            <TbTable size="24px" />
                        ) : (
                            <TbCards size="24px" />
                        )}
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            {isNodeIntegrationsEnabled && (
                <ActionIconGroup>
                    <Tooltip label={t('node-integrations.modal.title')} withArrow>
                        <ActionIcon
                            color="pink"
                            onClick={() => showModal('nodeIntegrations_nodeIntegrationsModal')}
                            size="input-md"
                            variant="soft"
                        >
                            <TbPlugConnected size="24px" />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>
            )}

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
                        variant="soft"
                    >
                        <PiSpiral size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('common.action.update')} withArrow>
                    <ActionIcon
                        loading={isGetNodesPending || isPending || isRefetching}
                        onClick={() => refetchNodes()}
                        size="input-md"
                        variant="soft"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
            <ActionIconGroup>
                <Tooltip label={t('common.action.create')} withArrow>
                    <ActionIcon
                        color="teal"
                        onClick={() => showModal('nodes_createNodeModal')}
                        size="input-md"
                        variant="soft"
                    >
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
