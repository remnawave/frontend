import { ReactNode } from 'react';
import clsx from 'clsx';
import { Box, BoxProps } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import classes from './sticky-header.module.css';

interface StickyHeaderProps extends BoxProps {
  offset?: number;
  children?: ReactNode;
}

export function StickyHeader({ children, offset = 2, className, ...rest }: StickyHeaderProps) {
  const [scroll] = useWindowScroll();

  return (
    <Box
      component="header"
      className={clsx(classes.root, className)}
      data-sticked={scroll.y > offset}
      {...rest}
    >
      {children}
    </Box>
  );
}
