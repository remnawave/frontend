import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone
} from 'react-icons/pi'
import { TUsersStatus, USERS_STATUS } from '@remnawave/backend-contract'
import { Badge, BadgeProps } from '@mantine/core'

interface IProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}

export function UserStatusBadge({ status, ...props }: IProps) {
    let icon: React.ReactNode
    let variant: BadgeProps['variant'] = 'gradient-gray'
    switch (status) {
        case USERS_STATUS.ACTIVE:
            icon = <PiPulseDuotone size={18} />
            variant = 'gradient-teal'
            break
        case USERS_STATUS.DISABLED:
            icon = <PiProhibitDuotone size={18} />
            variant = 'gradient-gray'
            break
        case USERS_STATUS.EXPIRED:
            icon = <PiClockUserDuotone size={18} />
            variant = 'gradient-red'
            break
        case USERS_STATUS.LIMITED:
            icon = <PiClockCountdownDuotone size={18} />
            variant = 'gradient-orange'
            break
        default:
            break
    }

    return (
        <Badge leftSection={icon} size="lg" variant={variant} {...props}>
            {status}
        </Badge>
    )
}
