import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbTrash } from 'react-icons/tb'

import { useHostsStoreActions, useHostsStoreEditModalHost } from '@entities/dashboard'
import { useDeleteHost } from '@shared/api/hooks'

export function DeleteHostFeature() {
    const { t } = useTranslation()

    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()

    const { mutate: deleteHost, isPending: isDeleteHostPending } = useDeleteHost({
        mutationFns: {
            onSuccess: () => {
                actions.toggleEditModal(false)
            }
        }
    })

    if (!host) return null

    const handleDeleteHost = async () => {
        deleteHost({ route: { uuid: host.uuid } })
    }

    return (
        <Tooltip label={t('delete-host.feature.delete-host')}>
            <ActionIcon
                color="red"
                loading={isDeleteHostPending}
                onClick={handleDeleteHost}
                radius="md"
                size="lg"
                variant="light"
            >
                <TbTrash size="20px" />
            </ActionIcon>
        </Tooltip>
    )
}
