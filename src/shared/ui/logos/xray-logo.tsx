/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function XrayLogo({ size = 20, style, ...props }: LogoProps) {
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
            viewBox="0 0 35 35"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M16.6961 15.2606L16.5825 3.49701C16.5718 2.38439 15.025 2.11843 14.6433 3.16356L11.7279 11.1447C11.6384 11.3898 11.4566 11.5902 11.2213 11.7031L5.66765 14.3687C4.70841 14.8291 5.03635 16.2703 6.10036 16.2703H15.6962C16.2522 16.2703 16.7015 15.8166 16.6961 15.2606Z"
                fill="currentColor"
            />
            <path
                d="M18.6471 15.2703V5.88936C18.6471 4.84679 20.0428 4.49998 20.5308 5.4213L23.5833 11.1845C23.7 11.4049 23.8948 11.5737 24.1296 11.6578L31.5829 14.3289C32.6388 14.7073 32.3671 16.2703 31.2455 16.2703H19.6471C19.0948 16.2703 18.6471 15.8226 18.6471 15.2703Z"
                fill="currentColor"
            />
            <path
                d="M18.6471 31.4643V19.3784C18.6471 18.8261 19.0948 18.3784 19.6471 18.3784H29.2853C30.3376 18.3784 30.676 19.7947 29.7374 20.2704L24.1129 23.1208C23.889 23.2343 23.716 23.4278 23.6281 23.663L20.5839 31.8141C20.1941 32.8578 18.6471 32.5783 18.6471 31.4643Z"
                fill="currentColor"
            />
            <path
                d="M16.7059 28.9873V19.3784C16.7059 18.8261 16.2582 18.3784 15.7059 18.3784H3.83963C2.71522 18.3784 2.44656 19.9473 3.50691 20.3214L11.5457 23.1578C11.7987 23.247 12.0052 23.4342 12.1188 23.6772L14.8 29.4109C15.2531 30.3797 16.7059 30.0568 16.7059 28.9873Z"
                fill="currentColor"
            />
        </Box>
    )
}
