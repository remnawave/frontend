import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends Omit<BoxProps, 'children' | 'ref'>,
        ElementProps<'svg', keyof BoxProps> {
    size?: string | number
}

export function Logo({ size, style, ...props }: LogoProps) {
    return (
        <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
            style={{ width: size, height: size, ...style }}
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M8 1a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.5 0V1.75A.75.75 0 0 1 8 1Zm6 2a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5A.75.75 0 0 1 14 3ZM5 4a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 5 4Zm6 1a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 11 5ZM2 6a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 2 6Z"
                clipRule="evenodd"
            />
        </Box>
    )
}
