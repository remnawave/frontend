/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function SurgeLogo({ size = 20, style, ...props }: LogoProps) {
    return (
        <Box
            component="svg"
            fill="currentColor"
            preserveAspectRatio="xMidYMid meet"
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                ...style
            }}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect height="80" rx="20" width="40" x="96" y="286" />
            <rect height="190" rx="20" width="40" x="166" y="227" />
            <rect height="260" rx="20" width="40" x="237" y="126" />
            <rect height="190" rx="20" width="40" x="308" y="96" />
            <rect height="80" rx="20" width="40" x="378" y="147" />
        </Box>
    )
}
