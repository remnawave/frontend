import { Box, BoxProps, ElementProps, rgba, useMantineTheme } from '@mantine/core'

type MetricCardIcon = ElementProps<'div', keyof BoxProps> & Omit<BoxProps, 'children'>

export function MetricCardIcon({ display = 'flex', ...props }: MetricCardIcon) {
    const theme = useMantineTheme()
    const primaryColor = theme.colors[theme.primaryColor][6]

    return (
        <Box
            display={display}
            p="xs"
            {...props}
            style={{
                borderRadius: 'var(--mantine-radius-md)',
                alignItems: 'center',
                background: rgba(primaryColor, 0.15),
                backdropFilter: 'blur(8px)',
                boxShadow: `0 4px 12px ${rgba(primaryColor, 0.1)}`
            }}
        />
    )
}
