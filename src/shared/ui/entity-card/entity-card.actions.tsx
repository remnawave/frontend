import { Group } from '@mantine/core'

import classes from './entity-card.module.css'

interface ActionsProps {
    children: React.ReactNode
}

export function EntityCardActions({ children }: ActionsProps) {
    return (
        <Group className={classes.actions} gap={0} wrap="nowrap">
            {children}
        </Group>
    )
}
