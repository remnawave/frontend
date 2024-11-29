import { Paper, ScrollArea, Text } from '@mantine/core'
import { Logo } from '@shared/ui/logo'
import { Outlet } from 'react-router-dom'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import classes from './root.module.css'

export function DashboardLayout() {
    return (
        <div className={classes.root}>
            <Paper className={classes.sidebarWrapper} withBorder radius="md">
                <div className={classes.logoWrapper}>
                    <Logo w="3rem" color="red" c="red" />
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
