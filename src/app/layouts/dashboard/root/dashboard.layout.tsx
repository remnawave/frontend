import { Code, Divider, Group, Image, Paper, ScrollArea, Stack } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { PiLink } from 'react-icons/pi'

import { Logo } from '@shared/ui/logo'
import { app } from '@/config'

import { SidebarLayout } from '../sidebar/sidebar.layout'
import packageJson from '../../../../../package.json'
import classes from './dashboard.module.css'
import { Header } from '../header/header'

export function DashboardLayout() {
    return (
        <div className={classes.root}>
            <Paper className={classes.sidebarWrapper} radius="md" withBorder>
                <Group className={classes.logoWrapper} justify="space-between">
                    <Logo c="cyan" color="red" w="3rem" />
                    <Code c="cyan" fw={700}>
                        {`v${packageJson.version}`}
                    </Code>
                </Group>

                <ScrollArea flex="1" px="md">
                    <SidebarLayout />
                </ScrollArea>

                <Divider
                    label={<PiLink color={'var(--mantine-color-cyan-6)'} size={'1.4rem'} />}
                    labelPosition="center"
                    variant="dashed"
                />

                <Stack align="center" justify="center" pt="md">
                    <Image
                        h="auto"
                        onClick={() => window.open(app.githubOrg, '_blank')}
                        radius="lg"
                        src="https://img.shields.io/github/stars/remnawave?style=for-the-badge&logo=github&logoColor=fffff&label=Stars&labelColor=21262d&color=30363d&cacheSeconds=1"
                        style={{ cursor: 'pointer' }}
                        w="10rem"
                    />
                </Stack>
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
