import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'

import { useDeleteInfraBillingHistoryRecord } from '@shared/api/hooks'

export function useDeleteBillingRecord(refetchRecords: () => void) {
    const { t } = useTranslation()

    const { mutate: deleteRecord } = useDeleteInfraBillingHistoryRecord({
        mutationFns: {
            onSuccess: () => {
                refetchRecords()
            }
        }
    })

    return (uuid: string) =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: { confirm: t('common.action.delete'), cancel: t('common.action.cancel') },
            centered: true,
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            onConfirm: () => deleteRecord({ route: { uuid } })
        })
}
