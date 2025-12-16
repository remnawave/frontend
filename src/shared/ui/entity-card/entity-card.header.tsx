import { Group, Stack } from '@mantine/core'

interface HeaderProps {
    children: React.ReactNode
}

export function EntityCardHeader({ children }: HeaderProps) {
    return (
        <Stack gap="md">
            <Group gap="md" wrap="nowrap">
                {children}
            </Group>
        </Stack>
    )
}
