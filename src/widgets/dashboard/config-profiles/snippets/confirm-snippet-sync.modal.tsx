import { TbCode } from 'react-icons/tb'

import { openApplyToNodesModal } from '@shared/_modals/universal'

export const openConfirmSnippetSyncModal = (onConfirm: () => void) => {
    openApplyToNodesModal({
        IconComponent: TbCode,
        iconColor: 'teal',
        delay: 250,
        onApply: onConfirm
    })
}
