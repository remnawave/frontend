import { Box, BoxProps, ElementProps } from '@mantine/core'

type MetricCardIcon = ElementProps<'div', keyof BoxProps> & Omit<BoxProps, 'children'>

export function MetricCardIcon({ display = 'flex', ...props }: MetricCardIcon) {
    return (
        <Box
            display={display}
            {...props}
            style={{
                borderRadius: 'var(--mantine-radius-md)',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        />
    )
}
