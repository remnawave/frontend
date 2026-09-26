import { modals } from '@mantine/modals'
import { t } from 'i18next'
import { useState } from 'react'
import { TbCode } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { useDeleteSnippet, useSyncSnippet } from '@shared/api/hooks'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useIsMobile } from '@shared/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { openConfirmSnippetSyncModal } from './confirm-snippet-sync.modal'
import { EDIT_SNIPPET_MODAL_ID, EditSnippetModal } from './edit-snippet.modal'
import { TSnippet } from './types'

export function useSnippetActions() {
    const isMobile = useIsMobile()

    const [deletingName, setDeletingName] = useState<null | string>(null)

    const { mutate: deleteSnippet } = useDeleteSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
            }
        }
    })

    const { mutate: syncSnippet } = useSyncSnippet()

    const handleDelete = (name: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            centered: true,
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            onConfirm: () => {
                setDeletingName(name)
                deleteSnippet(
                    { variables: { name } },
                    {
                        onSuccess: () => {
                            openConfirmSnippetSyncModal(() => {
                                syncSnippet({ variables: { name } })
                            })
                        },
                        onSettled: () => setDeletingName(null)
                    }
                )
            }
        })
    }

    const handleEdit = (snippet: TSnippet) => {
        modals.open({
            modalId: EDIT_SNIPPET_MODAL_ID,
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.edit-snippet')}
                />
            ),
            centered: true,
            size: '80%',
            fullScreen: isMobile,
            transitionProps: { transition: 'fade' },
            children: <EditSnippetModal snippet={snippet} />
        })
    }

    return { deletingName, handleDelete, handleEdit }
}
