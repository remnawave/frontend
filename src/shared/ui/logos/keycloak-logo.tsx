/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function KeycloakLogo({ size = 20, style, ...props }: LogoProps) {
    return (
        <Box
            component="svg"
            preserveAspectRatio="xMidYMid meet"
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                ...style
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="m18.742 1.182l-12.493.002C4.155 4.784 2.079 8.393 0 12.002c2.071 3.612 4.162 7.214 6.252 10.816l12.49-.004l3.089-5.404h2.158v-.002H24L23.996 6.59h-2.168z"
                fill="#6B6B6B"
            />
            <path
                d="M8.327 4.792h2.081l1.04 1.8l-3.12 5.413l3.117 5.403l-1.035 1.81H8.327a2048 2048 0 0 0-4.168-7.204zm6.241 0l2.086.003q2.088 3.608 4.166 7.222l-4.167 7.2h-2.08c-.382-.562-1.038-1.808-1.038-1.808l3.123-5.405l-3.124-5.413z"
                fill="#00B8E3"
            />
        </Box>
    )
}
