import { modals } from '@mantine/modals'
import { t } from 'i18next'
import { useState } from 'react'

import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteSharedList } from '@shared/api/hooks'

export function useSharedListActions() {
    const [deletingName, setDeletingName] = useState<null | string>(null)

    const { mutate: deleteSharedList } = useDeleteSharedList({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getSharedLists.queryKey
                })
            }
        }
    })

    const handleDelete = (name: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('shared-lists.modal.delete-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            centered: true,
            onConfirm: () => {
                setDeletingName(name)
                deleteSharedList(
                    { variables: { name } },
                    { onSettled: () => setDeletingName(null) }
                )
            }
        })
    }

    return { deletingName, handleDelete }
}
