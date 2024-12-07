import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { USERS_STATUS } from '@remnawave/backend-contract'
import { Button } from '@mantine/core'

import { useDisableUser, useEnableUser, usersQueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces'

export function ToggleUserStatusButtonFeature(props: IProps) {
    const { user } = props
    const { uuid } = user

    const { mutate: disableUser, isPending: isDisableUserPending } = useDisableUser({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(usersQueryKeys.getUserByUuid({ uuid }).queryKey, data)
            }
        }
    })

    const { mutate: enableUser, isPending: isEnableUserPending } = useEnableUser({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(usersQueryKeys.getUserByUuid({ uuid }).queryKey, data)
            }
        }
    })

    let buttonLabel = ''
    let color = 'blue'
    let icon = <PiTrashDuotone size="1rem" />

    if (user.status === USERS_STATUS.DISABLED) {
        color = 'green'
        buttonLabel = 'Enable'
        icon = <PiCellSignalFullDuotone size="1rem" />
    } else {
        color = 'red'
        buttonLabel = 'Disable'
        icon = <PiCellSignalSlashDuotone size="1rem" />
    }

    const handleToggleUserStatus = async () => {
        if (user.status !== USERS_STATUS.DISABLED) {
            disableUser({ route: { uuid } })
        } else {
            enableUser({ route: { uuid } })
        }
    }

    return (
        <Button
            color={color}
            leftSection={icon}
            loading={isDisableUserPending || isEnableUserPending}
            onClick={handleToggleUserStatus}
            size="md"
            type="button"
        >
            {buttonLabel} user
        </Button>
    )
}
