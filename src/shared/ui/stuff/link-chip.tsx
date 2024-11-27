import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Chip, ChipProps } from '@mantine/core';

interface LinkChipProps extends ChipProps {
  href?: string;
  inline?: boolean;
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
);
