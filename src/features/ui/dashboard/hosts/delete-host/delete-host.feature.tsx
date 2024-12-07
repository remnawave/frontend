import { ActionIcon, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'

import { useHostsStoreActions, useHostsStoreEditModalHost } from '@entities/dashboard'
import { useDeleteHost } from '@shared/api/hooks'

export function DeleteHostFeature() {
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
        <Tooltip label="Delete host">
            <ActionIcon
                color="red"
                loading={isDeleteHostPending}
                onClick={handleDeleteHost}
                size="xl"
            >
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
