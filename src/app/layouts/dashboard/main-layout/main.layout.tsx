import { useClickOutside, useDisclosure, useHeadroom, useMediaQuery } from '@mantine/hooks'
import { AppShell, Box, Burger, Container, Group, ScrollArea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import clsx from 'clsx'

import {
    useAppshellStoreActions,
    useAppshellStoreDesktopSidebarOpen
} from '@entities/dashboard/appshell'
import { useIsLoadingRemnawaveUpdates, useRemnawaveInfo } from '@entities/dashboard/updates-store'
import { ScrollToTopWrapper } from '@shared/hocs/scroll-to-top/scroll-to-top'
import { SidebarTitleShared } from '@shared/ui/sidebar/sidebar-title'
import { SidebarLogoShared } from '@shared/ui/sidebar/sidebar-logo'
import { HeaderControls } from '@shared/ui/header-buttons'
import { HelpDrawerShared } from '@shared/ui/help-drawer'
import { GameModalShared } from '@shared/ui/sidebar'

import { Navigation } from './navbar/navigation.layout'
import classes from './Main.module.css'

export function MainLayout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()

    const [isMediaQueryReady, setIsMediaQueryReady] = useState(false)
    const pinned = useHeadroom({ fixedAt: 120 })

    const isMobile = useMediaQuery(`(max-width: 64rem)`, undefined, {
        getInitialValueInEffect: false
    })
    const isSocialButton = useMediaQuery(`(max-width: 40rem)`, undefined, {
        getInitialValueInEffect: false
    })

    const isDesktopSidebarOpen = useAppshellStoreDesktopSidebarOpen()
    const { toggleDesktopSidebar } = useAppshellStoreActions()

    const remnawaveInfo = useRemnawaveInfo()
    const isLoadingUpdates = useIsLoadingRemnawaveUpdates()

    useEffect(() => {
        setIsMediaQueryReady(true)
    }, [isMobile, isSocialButton])

    const ref = useClickOutside(() => {
        if (isMobile && mobileOpened) {
            toggleMobile()
        }
    })

    if (!isMediaQueryReady) {
        return <div style={{ height: '100vh' }}></div>
    }

    return (
        <AppShell
            className={isMobile ? undefined : classes.appShellFadeIn}
            header={{ height: 64, collapsed: isMobile ? false : !pinned, offset: false }}
            layout="alt"
            navbar={{
                width: 300,
                breakpoint: 'lg',
                collapsed: { mobile: !mobileOpened, desktop: !isDesktopSidebarOpen }
            }}
            padding={isMobile ? 'md' : 'xl'}
            transitionDuration={500}
            transitionTimingFunction="ease-in-out"
        >
            <AppShell.Header className={classes.header} withBorder={false}>
                <Container fluid px="lg" py="xs">
                    <Group justify="space-between" style={{ flexWrap: 'nowrap' }}>
                        <Group style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <Burger
                                onClick={isMobile ? toggleMobile : toggleDesktopSidebar}
                                opened={isMobile ? mobileOpened : isDesktopSidebarOpen}
                                size="md"
                            />
                        </Group>
                        <Group style={{ flexShrink: 0 }}>
                            <HeaderControls
                                githubLink="https://github.com/remnawave/panel"
                                isGithubLoading={isLoadingUpdates}
                                stars={remnawaveInfo.starsCount || undefined}
                                telegramLink="https://t.me/remnawave"
                                withGithub={!isSocialButton}
                                withSupport={!isSocialButton}
                                withTelegram={!isSocialButton}
                            />
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>
            <AppShell.Navbar
                className={clsx(classes.sidebarWrapper, {
                    [classes.sidebarWrapperClosedDesktop]: !isMobile && !isDesktopSidebarOpen,
                    [classes.sidebarWrapperClosedMobile]: isMobile && !mobileOpened
                })}
                p="md"
                pb={0}
                ref={ref}
                w={300}
                withBorder={false}
            >
                <AppShell.Section className={classes.logoSection}>
                    <Box style={{ position: 'absolute', left: '0' }}>
                        <Burger
                            hiddenFrom="lg"
                            onClick={isMobile ? toggleMobile : toggleDesktopSidebar}
                            opened={isMobile ? mobileOpened : isDesktopSidebarOpen}
                            size="sm"
                        />
                    </Box>

                    <Group gap="xs" justify="center" wrap="nowrap">
                        <SidebarLogoShared />
                        <SidebarTitleShared />
                    </Group>
                </AppShell.Section>
                <AppShell.Section
                    className={classes.scrollArea}
                    component={ScrollArea}
                    flex={1}
                    scrollbarSize="0.2rem"
                >
                    <Navigation isMobile={isMobile} onClose={toggleMobile} />
                </AppShell.Section>

                <AppShell.Section className={classes.footerSection}>
                    <GameModalShared />
                    {isSocialButton && (
                        <Group justify="center" mt="md" style={{ flexShrink: 0 }}>
                            <HeaderControls
                                githubLink="https://github.com/remnawave/panel"
                                isGithubLoading={isLoadingUpdates}
                                stars={remnawaveInfo.starsCount || undefined}
                                telegramLink="https://t.me/remnawave"
                                withLanguage={false}
                                withLogout={false}
                                withRefresh={false}
                                withVersion={false}
                            />
                        </Group>
                    )}
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main
                pb="var(--mantine-spacing-md)"
                pt="calc(var(--app-shell-header-height) + 10px)"
            >
                <ScrollToTopWrapper>
                    <Outlet />
                </ScrollToTopWrapper>
                <HelpDrawerShared />
            </AppShell.Main>
        </AppShell>
    )
}
