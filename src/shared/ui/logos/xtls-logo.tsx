import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function XtlsLogo({ size, style, ...props }: LogoProps) {
    return (
        <Box
            component="svg"
            fill="none"
            style={{ width: size, height: size, ...style }}
            viewBox="0 0 636 642"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M298.5 301.5V1L223 226L64 301.5H298.5Z" fill="currentColor" />
            <path d="M414 226L337 67.5V301.5H635.5L414 226Z" fill="currentColor" />
            <path d="M337 341.5V641L414 418L573 341.5H337Z" fill="currentColor" />
            <path d="M298.5 341.5V578L223 418L0.5 341.5H298.5Z" fill="currentColor" />
        </Box>
    )
}
