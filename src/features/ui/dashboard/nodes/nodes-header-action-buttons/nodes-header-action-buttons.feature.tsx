import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { TbPlus, TbRefresh, TbSearch } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { spotlight } from '@mantine/spotlight'
import { PiSpiral } from 'react-icons/pi'

import { useNodesStoreActions } from '@entities/dashboard/nodes/nodes-store/nodes-store'
import { useGetNodes, useRestartAllNodes } from '@shared/api/hooks'

export const NodesHeaderActionButtonsFeature = () => {
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

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <Tooltip label="Search nodes">
                    <ActionIcon
                        color="gray"
                        onClick={spotlight.open}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <TbSearch size="18px" />
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
                        onClick={() => restartAllNodes({})}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <PiSpiral size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('nodes-header-action-buttons.feature.update')} withArrow>
                    <ActionIcon
                        loading={isGetNodesPending || isPending || isRefetching}
                        onClick={() => refetchNodes()}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <TbRefresh size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('nodes-header-action-buttons.feature.create-new-node')} withArrow>
                    <ActionIcon
                        color="teal"
                        onClick={handleCreate}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
