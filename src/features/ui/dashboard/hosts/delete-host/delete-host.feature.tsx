import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbTrash } from 'react-icons/tb'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { useDeleteHost } from '@shared/api/hooks'

export function DeleteHostFeature() {
    const { t } = useTranslation()

    const { internalState: host } = useModalState(MODALS.EDIT_HOST_MODAL)
    const close = useModalClose(MODALS.EDIT_HOST_MODAL)

    const { mutate: deleteHost, isPending: isDeleteHostPending } = useDeleteHost({
        mutationFns: {
            onSuccess: () => {
                close()
            }
        }
    })

    if (!host) return null

    const handleDeleteHost = async () => {
        deleteHost({ route: { uuid: host.uuid } })
    }

    return (
        <Tooltip label={t('common.delete')}>
            <ActionIcon
                color="red"
                loading={isDeleteHostPending}
                onClick={handleDeleteHost}
                size="lg"
                variant="light"
            >
                <TbTrash size="20px" />
            </ActionIcon>
        </Tooltip>
    )
}
