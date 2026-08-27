import { modals } from '@mantine/modals'
import { t } from 'i18next'
import { useState } from 'react'

import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteNodeIntegration } from '@shared/api/hooks'

export function useNodeIntegrationActions() {
    const [deletingUuid, setDeletingUuid] = useState<null | string>(null)

    const { mutate: deleteNodeIntegration } = useDeleteNodeIntegration({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodeIntegrations.getNodeIntegrations.queryKey
                })
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodes.getAllNodes.queryKey
                })
            }
        }
    })

    const handleDelete = (uuid: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('node-integrations.modal.delete-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            centered: true,
            onConfirm: () => {
                setDeletingUuid(uuid)
                deleteNodeIntegration(
                    { route: { uuid } },
                    { onSettled: () => setDeletingUuid(null) }
                )
            }
        })
    }

    return { deletingUuid, handleDelete }
}
