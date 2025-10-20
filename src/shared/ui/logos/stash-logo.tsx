/* eslint-disable @stylistic/indent */
import { Box, BoxProps, ElementProps } from '@mantine/core'

interface LogoProps
    extends ElementProps<'svg', keyof BoxProps>,
        Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

export function StashLogo({ size = 20, style, ...props }: LogoProps) {
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
                d="M17.1777 3.49219C22.7084 3.17626 25.751 8.46146 25.6309 14.8838C28.5419 15.9072 34.6036 21.9193 31.7598 27.0469C29.0274 31.9729 24.0678 32.8955 17.498 29.21C15.0944 30.9726 6.76255 34.0977 3.35742 27.5684C0.838351 22.7376 4.19865 17.3125 9.16602 14.8838C9.00582 12.0611 10.1277 3.89517 17.1777 3.49219ZM9.60645 19.1182C8.16429 20.0797 5.88141 22.5641 6.80273 25.3281C7.70438 28.0318 11.5702 28.0114 13.9736 26.6895C11.53 24.2057 10.2794 21.4577 9.60645 19.1182ZM25.1904 19.1182C24.6777 22.6755 22.0918 25.6479 20.8633 26.6895C23.1866 27.8511 26.9239 27.9516 28.1143 25.3281C29.2213 22.8874 25.8854 19.4794 25.1904 19.1182ZM21.585 17.2354C20.1829 16.6879 16.5449 15.9214 13.2119 17.2354C13.3855 18.7042 14.3344 22.1628 17.4189 24.6064C18.9279 23.4044 21.4247 20.1996 21.585 17.2354ZM17.4189 7.58105C15.0554 7.58103 13.7328 9.98484 13.0518 13.1494C14.9746 12.5886 17.9395 12.2681 21.7051 13.1494C21.7051 11.3069 19.9424 7.58156 17.4189 7.58105Z"
                fill="currentColor"
            />
        </Box>
    )
}
