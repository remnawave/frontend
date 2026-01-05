import { Box, BoxProps, MantineSize } from '@mantine/core'

import classes from './shimmer-skeleton.module.css'

type SizeValue = MantineSize | number | (string & {})

interface IProps extends Omit<BoxProps, 'h' | 'w'> {
    height: SizeValue
    width: SizeValue
}

export function ShimmerSkeleton(props: IProps) {
    const { height, width, ...rest } = props

    return <Box className={classes.skeleton} h={height} w={width} {...rest} />
}
