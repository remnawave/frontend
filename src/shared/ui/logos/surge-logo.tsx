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
                d="M27.1 5.3H14.9L7.7 18h8.1l-4 11.7 15.5-17.4h-8.5l8.3-7Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="3"
            />
        </Box>
    )
}
