import { PiClockCountdown, PiClockUser, PiProhibit, PiPulse } from 'react-icons/pi'
import { TUsersStatus, USERS_STATUS } from '@remnawave/backend-contract'
import { Badge, BadgeProps } from '@mantine/core'

interface IProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}

export function UserStatusBadge({ status, ...props }: IProps) {
    let icon: React.ReactNode
    let color: BadgeProps['color'] = 'gray'
    switch (status) {
        case USERS_STATUS.ACTIVE:
            icon = <PiPulse size={18} />
            color = 'teal'
            break
        case USERS_STATUS.DISABLED:
            icon = <PiProhibit size={18} />
            color = 'shaded-gray'
            break
        case USERS_STATUS.EXPIRED:
            icon = <PiClockUser size={18} />
            color = 'red'
            break
        case USERS_STATUS.LIMITED:
            icon = <PiClockCountdown size={18} />
            color = 'orange'
            break
        default:
            break
    }

    return (
        <Badge color={color} leftSection={icon} size="lg" variant="soft" {...props}>
            {status}
        </Badge>
    )
}
