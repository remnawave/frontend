import { ActionIcon, ActionIconProps, PolymorphicComponentProps } from '@mantine/core'

import classes from './entity-card.module.css'

interface EntityCardIconProps extends PolymorphicComponentProps<'div', ActionIconProps> {
    highlight?: boolean
}

export function EntityCardIcon({ children, highlight = true, ...props }: EntityCardIconProps) {
    return (
        <ActionIcon
            className={classes.icon}
            component="div"
            color={highlight ? 'teal' : 'gray'}
            size="lg"
            variant="soft"
            {...props}
        >
            {children}
        </ActionIcon>
    )
}
