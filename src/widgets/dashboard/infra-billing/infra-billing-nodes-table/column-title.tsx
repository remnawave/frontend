import { Group, Text } from '@mantine/core'

export const InfraProvidersColumnTitle = ({
    icon: Icon,
    title,
    justify = undefined
}: {
    icon: React.ComponentType<{ color?: string; size?: number }>
    justify?: 'flex-end' | 'flex-start' | undefined
    title: string
}) => (
    <Group gap="xs" justify={justify} wrap="nowrap">
        <Icon color="var(--mantine-color-gray-4)" size={16} />
        <Text fw={600} size="sm">
            {title}
        </Text>
    </Group>
)
