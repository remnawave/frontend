import { Chip, ChipProps } from '@mantine/core'
import { NavLink } from 'react-router-dom'
import { forwardRef } from 'react'

interface LinkChipProps extends ChipProps {
    href?: string
    inline?: boolean
}

export const LinkChip = forwardRef<HTMLInputElement, LinkChipProps>(
    ({ size = 'xs', variant = 'outline', checked = false, inline, href, ...props }, ref) => (
        <Chip
            {...props}
            checked={checked}
            size={size}
            style={{ ...props.style, display: inline ? 'inline-block' : 'block' }}
            variant={variant}
            wrapperProps={href ? { component: NavLink, to: href, ref } : { ref }}
        />
    )
)
