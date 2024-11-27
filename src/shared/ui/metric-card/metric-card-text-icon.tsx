import { Box, BoxProps, ElementProps } from '@mantine/core';

type MetricCardIcon = Omit<BoxProps, 'children'> & ElementProps<'div', keyof BoxProps>;

export function MetricCardIcon({ display = 'flex', ...props }: MetricCardIcon) {
    return (
        <Box
            display={display}
            {...props}
            style={{
                borderRadius: 'var(--mantine-radius-md)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        />
    );
}
