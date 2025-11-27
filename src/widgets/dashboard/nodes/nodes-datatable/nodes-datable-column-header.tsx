import { Group, Text } from '@mantine/core'

export const NodesDataTableColumnHeader = ({
    icon: Icon,
    title
}: {
    icon: React.ComponentType<{ color?: string; size?: number }>
    title: string
}) => (
    <Group gap="xs" wrap="nowrap">
        <Icon color="var(--mantine-color-gray-4)" size={16} />
        <Text fw={600} size="sm">
            {title}
        </Text>
    </Group>
)
