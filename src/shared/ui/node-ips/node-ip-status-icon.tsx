import { ThemeIcon, ThemeIconProps } from '@mantine/core'

import { resolveNodeIpStatusMeta } from './node-ip-status.constants'

interface IProps {
    iconSize?: number
    size?: ThemeIconProps['size']
    status: string
    variant?: ThemeIconProps['variant']
}

export const NodeIpStatusIcon = (props: IProps) => {
    const { status, size = 'md', iconSize = 14, variant = 'soft' } = props

    const meta = resolveNodeIpStatusMeta(status)

    return (
        <ThemeIcon color={meta.color} radius="sm" size={size} variant={variant}>
            <meta.Icon size={iconSize} />
        </ThemeIcon>
    )
}
