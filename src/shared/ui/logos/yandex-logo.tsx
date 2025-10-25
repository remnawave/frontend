/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function YandexLogo({ size = 20, style, ...props }: LogoProps) {
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
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="22" cy="22" fill="#FC3F1D" r="22" />
            <path
                d="M24.7407 33.9778H29.0889V9.04443H22.7592C16.3929 9.04443 13.0538 12.303 13.0538 17.1176C13.0538 21.2731 15.2187 23.6163 19.0532 26.1609L21.3832 27.6987L18.3927 25.1907L12.4667 33.9778H17.1818L23.5115 24.5317L21.3098 23.0671C18.6496 21.2731 17.3469 19.8818 17.3469 16.8613C17.3469 14.2068 19.2183 12.4128 22.7776 12.4128H24.7223V33.9778H24.7407Z"
                fill="currentColor"
            />
        </Box>
    )
}
