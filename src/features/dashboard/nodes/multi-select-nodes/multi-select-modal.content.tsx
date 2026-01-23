import {
    GetAllNodesCommand,
    NODES_BULK_ACTIONS,
    TNodesBulkActions
} from '@remnawave/backend-contract'
import { TbCheck, TbPlayerStop, TbRefresh, TbRocket } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { Stack } from '@mantine/core'

import { QueryKeys, useBulkNodesActions } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { ActionCardShared } from '@shared/ui'

type NodeType = GetAllNodesCommand.Response['response'][number]

interface IProps {
    selectedRecords: NodeType[]
    setSelectedRecords: (records: NodeType[]) => void
}

export const MultiSelectNodesModalContent = (props: IProps) => {
    const { selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()
    const { mutateAsync: bulkAction, isPending } = useBulkNodesActions()

    const uuids = selectedRecords.map((node) => node.uuid)

    const handleAction = async (action: TNodesBulkActions) => {
        if (isPending || uuids.length === 0) return
        await bulkAction({ variables: { uuids, action } })

        queryClient.refetchQueries({ queryKey: QueryKeys.nodes.getAllNodes.queryKey })
        modals.closeAll()
        setSelectedRecords([])
    }

    return (
        <Stack gap="xs">
            <ActionCardShared
                description={`${uuids.length} node(s)`}
                icon={<TbRocket size={20} />}
                isLoading={isPending}
                onClick={() => handleAction(NODES_BULK_ACTIONS.RESTART)}
                title={t('restart-node-button.feature.restart')}
                variant="gradient-teal"
            />
            <ActionCardShared
                description={`${uuids.length} node(s)`}
                icon={<TbPlayerStop size={20} />}
                isLoading={isPending}
                onClick={() => handleAction(NODES_BULK_ACTIONS.DISABLE)}
                title={t('common.disable')}
                variant="gradient-orange"
            />
            <ActionCardShared
                description={`${uuids.length} node(s)`}
                icon={<TbCheck size={20} />}
                isLoading={isPending}
                onClick={() => handleAction(NODES_BULK_ACTIONS.ENABLE)}
                title={t('common.enable')}
                variant="gradient-cyan"
            />
            <ActionCardShared
                description={`${uuids.length} node(s)`}
                icon={<TbRefresh size={20} />}
                isLoading={isPending}
                onClick={() => handleAction(NODES_BULK_ACTIONS.RESET_TRAFFIC)}
                title={t('reset-node-traffic.feature.reset-traffic')}
                variant="gradient-violet"
            />
        </Stack>
    )
}
