import { Loader, Menu } from '@mantine/core'
import { GetUserByIdCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'

import { queryClient } from '@shared/api'
import { useDisableUser, useEnableUser, usersQueryKeys } from '@shared/api/hooks'

interface IProps {
    user: GetUserByIdCommand.Response['response']
}

export function ToggleUserStatusButtonFeature(props: IProps) {
    const { t } = useTranslation()

    const { user } = props
    const { id } = user

    const { mutate: disableUser, isPending: isDisableUserPending } = useDisableUser({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(usersQueryKeys.getUserById({ userId: id }).queryKey, data)
            }
        }
    })

    const { mutate: enableUser, isPending: isEnableUserPending } = useEnableUser({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(usersQueryKeys.getUserById({ userId: id }).queryKey, data)
            }
        }
    })

    let buttonLabel = ''
    let color = 'blue'
    let icon = <PiTrashDuotone size="16px" />

    if (user.status === USERS_STATUS.DISABLED) {
        color = 'teal'
        buttonLabel = t('common.action.enable')
        icon = <PiCellSignalFullDuotone size="16px" />
    } else {
        color = 'var(--mantine-color-red-5)'
        buttonLabel = t('common.action.disable')
        icon = <PiCellSignalSlashDuotone size="16px" />
    }

    const handleToggleUserStatus = async () => {
        if (user.status !== USERS_STATUS.DISABLED) {
            disableUser({ route: { userId: id } })
        } else {
            enableUser({ route: { userId: id } })
        }
    }

    return (
        <Menu.Item
            color={color}
            leftSection={
                isDisableUserPending || isEnableUserPending ? (
                    <Loader color={color} size="1rem" />
                ) : (
                    icon
                )
            }
            onClick={handleToggleUserStatus}
        >
            {buttonLabel}
        </Menu.Item>
    )
}
