import { modals } from '@mantine/modals'
import { t } from 'i18next'
import { TbCode } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

export const openConfirmSnippetSyncModal = (onConfirm: () => void) => {
    setTimeout(() => {
        modals.openConfirmModal({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('common.confirm-action')}
                    titleOrder={5}
                />
            ),
            children: t('snippets.drawer.widget.sync-nodes-description'),
            labels: {
                confirm: t('restart-node-button.feature.restart'),
                cancel: t('snippets.drawer.widget.sync-nodes-cancel')
            },
            centered: true,
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'teal', variant: 'soft' },
            onConfirm
        })
    }, 250)
}
