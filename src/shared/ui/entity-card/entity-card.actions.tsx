import { Group } from '@mantine/core'

interface ActionsProps {
    children: React.ReactNode
}

export function EntityCardActions({ children }: ActionsProps) {
    return (
        <Group gap={0} wrap="nowrap">
            {children}
        </Group>
    )
}
