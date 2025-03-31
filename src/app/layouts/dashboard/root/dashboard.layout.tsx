import { Center, Code, Group, Paper, ScrollArea, Stack } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import { TelegramIconShared } from '@shared/ui/telegram-icon/telegram-icon.shared'
import { GithubStarsShared } from '@shared/ui/github-stars/github-stars.shared'
import { BuildInfoModal } from '@shared/ui/build-info-modal/build-info-modal'
import { Logo } from '@shared/ui/logo'

import { SidebarLayout } from '../sidebar/sidebar.layout'
import packageJson from '../../../../../package.json'
import classes from './dashboard.module.css'
import { Header } from '../header/header'

export function DashboardLayout() {
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)

    return (
        <div className={classes.root}>
            <Paper className={classes.sidebarWrapper} radius="md" withBorder>
                <Stack gap="md" pb="md" pt="md">
                    <Group className={classes.logoWrapper} justify="space-between">
                        <Logo c="cyan" color="red" w="3rem" />
                        <Code
                            c="cyan"
                            fw={700}
                            onClick={() => setBuildInfoModalOpened(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            {`v${packageJson.version}`}
                        </Code>
                    </Group>
                    <Center>
                        <Group gap="sm">
                            <TelegramIconShared />
                            <GithubStarsShared />
                        </Group>
                    </Center>
                </Stack>

                <ScrollArea flex="1" px="md">
                    <SidebarLayout />
                </ScrollArea>
            </Paper>
            <div className={classes.content}>
                <Header />

                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
            <BuildInfoModal
                onClose={() => setBuildInfoModalOpened(false)}
                opened={buildInfoModalOpened}
            />
        </div>
    )
}
