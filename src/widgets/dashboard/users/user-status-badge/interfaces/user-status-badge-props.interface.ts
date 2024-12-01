import { TUsersStatus } from '@remnawave/backend-contract'
import { BadgeProps } from '@mantine/core'

export interface UserStatusBadgeProps extends Omit<BadgeProps, 'children' | 'color'> {
    status: TUsersStatus
}
