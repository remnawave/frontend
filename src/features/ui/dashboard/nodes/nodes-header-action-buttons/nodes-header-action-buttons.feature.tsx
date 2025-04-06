import { PiArrowsClockwise, PiPlus, PiSpiral } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'

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
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isGetNodesPending || isPending || isRefetching}
                onClick={() => refetchNodes()}
                size="xs"
                variant="default"
            >
                {t('nodes-header-action-buttons.feature.update')}
            </Button>

            <Button
                c="teal"
                leftSection={<PiSpiral size="1rem" />}
                loading={isRestartAllNodesPending}
                onClick={() => restartAllNodes({})}
                size="xs"
                variant="default"
            >
                {t('nodes-header-action-buttons.feature.restart-all-nodes')}
            </Button>

            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
                size="xs"
                variant="default"
            >
                {t('nodes-header-action-buttons.feature.create-new-node')}
            </Button>
        </Group>
    )
}
