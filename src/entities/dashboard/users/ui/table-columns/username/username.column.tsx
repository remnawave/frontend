import { Box, Group, Indicator, Text } from '@mantine/core'

import { getConnectionStatusColorUtil, getTimeAgoUtil } from '@shared/utils/time-utils'
import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'

export function UsernameColumnEntity(props: IProps) {
    const { user } = props

    const color = getConnectionStatusColorUtil(user.onlineAt)
    const timeAgo = getTimeAgoUtil(user.onlineAt)

    return (
        <Group align="center" gap="md" wrap="nowrap">
            <Indicator color={color} inline processing size={12} zIndex={10} />
            <Box w="100%">
                <Text fw={500} size="sm" truncate="end">
                    {user.username}
                </Text>
                <Text c="dimmed" fw={600} size="xs">
                    {timeAgo}
                </Text>
            </Box>
        </Group>
    )
}
