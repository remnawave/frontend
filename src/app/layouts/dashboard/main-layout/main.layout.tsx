import { useClickOutside, useDisclosure, useHeadroom, useMediaQuery } from '@mantine/hooks'
import { AppShell, Box, Burger, Container, Group, ScrollArea } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'

import { ScrollToTopWrapper } from '@shared/hocs/scroll-to-top/scroll-to-top'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { SidebarTitleShared } from '@shared/ui/sidebar/sidebar-title'
import { SidebarLogoShared } from '@shared/ui/sidebar/sidebar-logo'
import { HeaderControls } from '@shared/ui/header-buttons'
import { VersionBadgeShared } from '@shared/ui/sidebar'
import { sToMs } from '@shared/utils/time-utils'
import { LoadingScreen } from '@shared/ui'

import { Navigation } from './navbar/navigation.layout'
import classes from './Main.module.css'

export function MainLayout() {
    const { data: authStatus, isLoading: isAuthStatusLoading } = useGetAuthStatus()

    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
    const [isMediaQueryReady, setIsMediaQueryReady] = useState(false)
    const pinned = useHeadroom({ fixedAt: 120 })

    const isMobile = useMediaQuery(`(max-width: 64rem)`, undefined, {
        getInitialValueInEffect: false
    })
    const isSocialButton = useMediaQuery(`(max-width: 40rem)`, undefined, {
        getInitialValueInEffect: false
    })

    useEffect(() => {
        setIsMediaQueryReady(true)
    }, [isMobile, isSocialButton])

    const ref = useClickOutside(() => {
        if (isMobile && mobileOpened) {
            toggleMobile()
        }
    })

    const { data, isLoading: isGithubLoading } = useQuery({
        queryKey: ['github-stars'],
        staleTime: sToMs(3600),
        refetchInterval: sToMs(3600),
        queryFn: async () => {
            const response = await axios.get<{
                totalStars: number
            }>('https://ungh.cc/stars/remnawave/*')
            return response.data
        }
    })

    if (isAuthStatusLoading) {
        return <LoadingScreen height="100vh" />
    }

    if (!isMediaQueryReady) {
        return <div style={{ height: '100vh' }}></div>
    }

    return (
        <AppShell
            header={{ height: 64, collapsed: isMobile ? false : !pinned, offset: false }}
            layout="alt"
            navbar={{
                width: 300,
                breakpoint: 'lg',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
            }}
            padding="xl"
            transitionDuration={500}
            transitionTimingFunction="ease-in-out"
        >
            <AppShell.Header className={classes.header} withBorder={false}>
                <Container fluid px="lg" py="xs">
                    <Group justify="space-between" style={{ flexWrap: 'nowrap' }}>
                        <Group style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <Burger
                                onClick={isMobile ? toggleMobile : toggleDesktop}
                                opened={isMobile ? mobileOpened : desktopOpened}
                                size="md"
                            />
                        </Group>
                        <Group style={{ flexShrink: 0 }}>
                            <HeaderControls
                                githubLink="https://github.com/remnawave/panel"
                                isGithubLoading={isGithubLoading}
                                stars={data?.totalStars}
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
                className={classes.sidebarWrapper}
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
                            onClick={isMobile ? toggleMobile : toggleDesktop}
                            opened={isMobile ? mobileOpened : desktopOpened}
                            size="sm"
                        />
                    </Box>

                    <Group gap="xs" justify="center" w="100%">
                        <SidebarLogoShared logoUrl={authStatus?.branding.logoUrl} />
                        <SidebarTitleShared title={authStatus?.branding.title} />
                        {!isMobile && <VersionBadgeShared />}
                    </Group>

                    {isMobile && (
                        <Group gap="xs" justify="center">
                            <VersionBadgeShared />
                        </Group>
                    )}
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
                    {isSocialButton && (
                        <Group justify="center" mt="md" style={{ flexShrink: 0 }}>
                            <HeaderControls
                                githubLink="https://github.com/remnawave/panel"
                                isGithubLoading={isGithubLoading}
                                stars={data?.totalStars}
                                telegramLink="https://t.me/remnawave"
                                withLanguage={false}
                                withLogout={false}
                                withRefresh={false}
                            />
                        </Group>
                    )}
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main pb="var(--mantine-spacing-md)" pt="var(--app-shell-header-height)">
                <ScrollToTopWrapper>
                    <Outlet />
                </ScrollToTopWrapper>
            </AppShell.Main>
        </AppShell>
    )
}
