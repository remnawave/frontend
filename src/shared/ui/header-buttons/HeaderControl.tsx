import { BoxProps, createPolymorphicComponent, UnstyledButton } from '@mantine/core'
import cx from 'clsx'

import classes from './HeaderControl.module.css'

export interface HeaderControlProps extends BoxProps {
    children: React.ReactNode
}

function _HeaderControl({ className, ...others }: HeaderControlProps) {
    return <UnstyledButton className={cx(classes.control, className)} {...others} />
}

export const HeaderControl = createPolymorphicComponent<'button', HeaderControlProps>(
    _HeaderControl
)
