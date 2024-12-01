import { Group } from '@mantine/core'

import { HeaderButtons } from '@features/ui/dashboard/header-buttons'
import { StickyHeader } from '@shared/ui/sticky-header'

import { SidebarButton } from './sidebar-button'
import classes from './header.module.css'

export function Header() {
    return (
        <StickyHeader className={classes.root}>
            <div className={classes.rightContent}>
                <SidebarButton />
            </div>

            <Group>
                <HeaderButtons />
            </Group>
        </StickyHeader>
    )
}
