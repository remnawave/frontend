import { Box, Group, Indicator, Text } from '@mantine/core'
import { IProps } from '@/entitites/dashboard/users/ui/table-columns/username/interface'
import { getConnectionStatusColorUtil, getTimeAgoUtil } from '@/shared/utils/time-utils'

export function UsernameColumnEntity(props: IProps) {
    const { user } = props

    const color = getConnectionStatusColorUtil(user.onlineAt)
    const timeAgo = getTimeAgoUtil(user.onlineAt)

    return (
        <Group wrap="nowrap" gap="md" align="center">
            <Indicator inline processing color={color} size={12} />
            <Box w="100%">
                <Text size="sm" fw={500} truncate="end">
                    {user.username}
                </Text>
                <Text size="xs" c="dimmed" fw={600}>
                    {timeAgo}
                </Text>
            </Box>
        </Group>
    )
}
