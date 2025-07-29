import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { USERS_STATUS } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Loader, Menu } from '@mantine/core'

import { useDisableUser, useEnableUser, usersQueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces'

export function ToggleUserStatusButtonFeature(props: IProps) {
    const { t } = useTranslation()

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
    let icon = <PiTrashDuotone size="16px" />

    if (user.status === USERS_STATUS.DISABLED) {
        color = 'teal'
        buttonLabel = t('toggle-user-status-button.feature.enable')
        icon = <PiCellSignalFullDuotone size="16px" />
    } else {
        color = 'var(--mantine-color-red-5)'
        buttonLabel = t('toggle-user-status-button.feature.disable')
        icon = <PiCellSignalSlashDuotone size="16px" />
    }

    const handleToggleUserStatus = async () => {
        if (user.status !== USERS_STATUS.DISABLED) {
            disableUser({ route: { uuid } })
        } else {
            enableUser({ route: { uuid } })
        }
    }

    return (
        <Menu.Item
            color={color}
            leftSection={
                isDisableUserPending || isEnableUserPending ? (
                    <Loader color={color} size={'1rem'} />
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
