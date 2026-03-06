import { Box, Divider, Group, Stack, Text, ThemeIcon, ThemeIconProps, Title } from '@mantine/core'
import { ReactNode } from 'react'

interface SettingsCardHeaderProps {
    description: ReactNode | string
    icon: ReactNode
    iconColor: ThemeIconProps['color']
    iconVariant: ThemeIconProps['variant']
    title: string
}

export function SettingsCardHeader({
    description,
    icon,
    iconColor,
    iconVariant,
    title
}: SettingsCardHeaderProps) {
    return (
        <Box>
            <Group align="flex-start" justify="space-between">
                <Group align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon color={iconColor} size="xl" variant={iconVariant}>
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
