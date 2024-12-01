import { Paper, ScrollArea } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import { Logo } from '@shared/ui/logo'

import classes from './root.module.css'
import { Sidebar } from '../sidebar'
import { Header } from '../header'

export function DashboardLayout() {
    return (
        <div className={classes.root}>
            <Paper className={classes.sidebarWrapper} radius="md" withBorder>
                <div className={classes.logoWrapper}>
                    <Logo c="red" color="red" w="3rem" />
                </div>
                <ScrollArea flex="1" px="md">
                    <Sidebar />
                </ScrollArea>
            </Paper>
            <div className={classes.content}>
                <Header />

                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
