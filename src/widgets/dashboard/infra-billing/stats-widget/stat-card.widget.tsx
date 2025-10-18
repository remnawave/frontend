import { Box, Group, Loader, Paper, rgba, Stack, Text, useMantineTheme } from '@mantine/core'

interface StatCardProps {
    color: string
    icon: React.ReactNode
    isLoading?: boolean
    subtitle?: string
    title: string
    value: number | string
}

export function StatCardWidget({ title, value, icon, color, subtitle, isLoading }: StatCardProps) {
    const theme = useMantineTheme()
    const primaryColor = theme.colors[theme.primaryColor][6]

    return (
        <Paper
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)'
                e.currentTarget.style.borderColor = 'var(--mantine-color-cyan-5)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.borderColor = 'var(--mantine-color-dark-4)'
            }}
            p="lg"
            shadow="sm"
            style={{
                border: '1px solid var(--mantine-color-dark-4)',
                background: `linear-gradient(
                    135deg,
                    var(--mantine-color-dark-6) 0%,
                    var(--mantine-color-dark-7) 100%
                )`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                cursor: 'default',
                transitionDuration: '0.3s'
            }}
        >
            <Group align="flex-start" justify="space-between">
                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Text
                        c="gray.4"
                        fw={500}
                        size="sm"
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {title}
                    </Text>
                    <Text c="gray.1" fw={700} size="xl">
                        {isLoading ? <Loader color={color} size="xs" /> : value}
                    </Text>
                    {subtitle && (
                        <Text
                            c="gray.5"
                            size="xs"
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {subtitle}
                        </Text>
                    )}
                </Stack>

                <Box
                    style={{
                        padding: '12px',
                        borderRadius: 'var(--mantine-radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: rgba(primaryColor, 0.15),
                        backdropFilter: 'blur(8px)',
                        boxShadow: `0 4px 12px ${rgba(primaryColor, 0.1)}`,
                        color: `var(--mantine-color-${color}-4)`
                    }}
                >
                    {icon}
                </Box>
            </Group>
        </Paper>
    )
}
