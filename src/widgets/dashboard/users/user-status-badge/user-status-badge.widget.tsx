import { PiClockCountdown, PiClockUser, PiProhibit, PiPulse } from 'react-icons/pi'
import { TUsersStatus, USERS_STATUS } from '@remnawave/backend-contract'
import { Badge, BadgeProps } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface IProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}

export function UserStatusBadge({ status, ...props }: IProps) {
    const { t } = useTranslation()

    let icon: React.ReactNode
    let color: BadgeProps['color'] = 'gray'
    let label: string = status
    switch (status) {
        case USERS_STATUS.ACTIVE:
            icon = <PiPulse size={18} />
            color = 'teal'
            label = t('user-status-badge.widget.active')
            break
        case USERS_STATUS.DISABLED:
            icon = <PiProhibit size={18} />
            color = 'shaded-gray'
            label = t('user-status-badge.widget.disabled')
            break
        case USERS_STATUS.EXPIRED:
            icon = <PiClockUser size={18} />
            color = 'red'
            label = t('user-status-badge.widget.expired')
            break
        case USERS_STATUS.LIMITED:
            icon = <PiClockCountdown size={18} />
            color = 'orange'
            label = t('user-status-badge.widget.limited')
            break
        default:
            break
    }

    return (
        <Badge color={color} leftSection={icon} size="lg" variant="soft" {...props}>
            {label}
        </Badge>
    )
}
