import { forwardRef } from 'react'

import { Chip, ChipProps } from '@mantine/core'
import { NavLink } from 'react-router-dom'

interface LinkChipProps extends ChipProps {
    href?: string
    inline?: boolean
}

export const LinkChip = forwardRef<HTMLInputElement, LinkChipProps>(
    ({ size = 'xs', variant = 'outline', checked = false, inline, href, ...props }, ref) => (
        <Chip
            {...props}
            style={{ ...props.style, display: inline ? 'inline-block' : 'block' }}
            wrapperProps={href ? { component: NavLink, to: href, ref } : { ref }}
            size={size}
            variant={variant}
            checked={checked}
        />
    )
)
