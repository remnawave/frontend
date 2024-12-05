import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { USERS_STATUS } from '@remnawave/backend-contract'
import { Button } from '@mantine/core'

import { useDisableUser, useEnableUser, useInvalidateUsersTSQ } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function ToggleUserStatusButtonFeature(props: IProps) {
    const { user } = props
    const invalidateUsers = useInvalidateUsersTSQ()

    const { mutate: disableUser, isPending: isDisableUserPending } = useDisableUser({
        mutationFns: {
            onSuccess: invalidateUsers
        }
    })
    const { mutate: enableUser, isPending: isEnableUserPending } = useEnableUser({
        mutationFns: {
            onSuccess: invalidateUsers
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
            disableUser({ route: { uuid: user.uuid } })
        } else {
            enableUser({ route: { uuid: user.uuid } })
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
