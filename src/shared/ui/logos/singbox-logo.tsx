/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function SingboxLogo({ size = 20, style, ...props }: LogoProps) {
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
                d="M17.5 31.5C16.823 31.5 16.1588 31.3169 15.5786 30.9702L6.82402 25.7514C6.26677 25.42 5.80392 24.9492 5.48419 24.3877C5.17207 23.8277 5.00459 23.198 5.00003 22.5578V11.8645C4.99755 11.218 5.16443 10.582 5.48425 10.0191C5.80407 9.45625 6.26581 8.98584 6.82402 8.65419L15.5786 4.01512C16.162 3.67773 16.825 3.5 17.5 3.5C18.175 3.5 18.838 3.67773 19.4214 4.01512L28.176 8.65419C28.7344 8.98597 29.1963 9.45662 29.5161 10.0198C29.836 10.583 30.0027 11.2193 30 11.866V22.5563C29.9954 23.198 29.8279 23.8277 29.5158 24.3877C29.1961 24.9492 28.7332 25.42 28.176 25.7514L19.4214 30.9702C18.8412 31.3169 18.177 31.5 17.5 31.5ZM17.5 31.5V17.2119M29.4991 10.0497L17.5 17.2119M17.5 17.2119L5.50093 10.0499M24.1687 18.9134V13.2299L11.5104 6.18126"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.5"
            />
        </Box>
    )
}
