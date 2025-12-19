import { ActionIcon, ActionIconProps, Box, PolymorphicComponentProps } from '@mantine/core'

import classes from './entity-card.module.css'

interface EntityCardIconProps extends PolymorphicComponentProps<'button', ActionIconProps> {
    highlight?: boolean
}

export function EntityCardIcon({ children, highlight = true, ...props }: EntityCardIconProps) {
    return (
        <Box className={classes.iconWrapper}>
            <ActionIcon
                className={classes.icon}
                color={highlight ? 'teal' : 'cyan'}
                size="xl"
                variant="light"
                {...props}
            >
                {children}
            </ActionIcon>
        </Box>
    )
}
