/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

// Stylized "V" inside a shield — visually distinct from XrayLogo so
// operators can tell at a glance which core a node is running.
export function VeilLogo({ size = 20, style, ...props }: LogoProps) {
    return (
        <Box
            component="svg"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                ...style
            }}
            viewBox="0 0 35 35"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M17.5 2L4 7.2v9.1c0 8.1 5.7 15.7 13.5 17.7C25.3 32 31 24.4 31 16.3V7.2L17.5 2z"
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
            />
            <path
                d="M11.5 12.2 17.5 24l6-11.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
            />
        </Box>
    )
}
