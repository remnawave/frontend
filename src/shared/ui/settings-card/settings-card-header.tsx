import { Box, Divider, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { ReactNode } from 'react'

interface SettingsCardHeaderProps {
    description: ReactNode | string
    icon: ReactNode
    title: string
}

export function SettingsCardHeader({ description, icon, title }: SettingsCardHeaderProps) {
    return (
        <Box>
            <Group align="flex-start" justify="space-between">
                <Group align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon color="cyan" size="xl" variant="light">
                        {icon}
                    </ThemeIcon>

                    <Stack gap={0}>
                        <Title order={4}>{title}</Title>
                        <Text c="dimmed" size="sm">
                            {description}
                        </Text>
                    </Stack>
                </Group>
            </Group>

            <Divider
                my="md"
                style={{
                    opacity: 0.3
                }}
            />
        </Box>
    )
}
