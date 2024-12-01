import { Stack, Text } from '@mantine/core'

import { IProps } from '@/entitites/dashboard/users/ui/table-columns/username/interface'
import { UserStatusBadge } from '@/widgets/dashboard/users/user-status-badge'
import { getExpirationTextUtil } from '@/shared/utils/time-utils'

export function StatusColumnEntity(props: IProps) {
    const { user } = props

    const expirationText = getExpirationTextUtil(user.expireAt)

    return (
        <Stack gap="xs">
            <UserStatusBadge status={user.status} />
            <Text c="dimmed" size="xs">
                {expirationText}
            </Text>
        </Stack>
    )
}
