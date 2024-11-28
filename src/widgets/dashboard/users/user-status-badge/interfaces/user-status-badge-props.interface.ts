import { BadgeProps } from '@mantine/core'
import { TUsersStatus } from '@remnawave/backend-contract'

export interface UserStatusBadgeProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}
