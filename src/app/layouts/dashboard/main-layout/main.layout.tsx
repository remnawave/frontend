import {
    AppShell,
    Badge,
    Burger,
    Container,
    Group,
    Indicator,
    ScrollArea,
    Text
} from '@mantine/core'
import { useClickOutside, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import semver from 'semver'
import axios from 'axios'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'
import { BuildInfoModal } from '@shared/ui/build-info-modal/build-info-modal'
import { HeaderControls } from '@shared/ui/header-buttons'
import { sToMs } from '@shared/utils/time-utils'
import { Logo } from '@shared/ui/logo'

import { Navigation } from './navbar/navigation.layout'
import packageJson from '../../../../../package.json'
import classes from './Main.module.css'

export function MainLayout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)
    const [isMediaQueryReady, setIsMediaQueryReady] = useState(false)

    const [versions, setVersions] = useState<{
        currentVersion: string
        latestVersion: string
    }>({
        currentVersion: '0.0.0',
        latestVersion: '0.0.0'
    })
    const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false)

    const buildInfo = getBuildInfo()

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

    const { data: latestVersion } = useQuery({
        queryKey: ['github-latest-version'],
        staleTime: sToMs(3600),
        refetchInterval: sToMs(3600),
        queryFn: async () => {
            const response = await axios.get<{
                release: {
                    tag: string
                }
            }>('https://ungh.cc/repos/remnawave/panel/releases/latest')
            return response.data.release.tag
        }
    })

    useEffect(() => {
        setVersions({
            currentVersion: buildInfo.tag ?? '0.0.0',
            latestVersion: latestVersion ?? '0.0.0'
        })
    }, [latestVersion, buildInfo.tag])

    useEffect(() => {
        setIsNewVersionAvailable(semver.gt(versions.latestVersion, versions.currentVersion))
    }, [versions])

    return isMediaQueryReady ? (
        <AppShell
            header={{ height: 64 }}
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
                pb="xl"
                ref={ref}
                w={300}
                withBorder={false}
            >
                <AppShell.Section>
                    <Group align="center" mb="md">
                        <Group gap="xs" justify="space-around" w="100%">
                            <Burger
                                hiddenFrom="lg"
                                onClick={isMobile ? toggleMobile : toggleDesktop}
                                opened={isMobile ? mobileOpened : desktopOpened}
                                size="sm"
                            />
                            <Group gap={4}>
                                <Logo c="cyan" w="2.5rem" />
                                <Text fw={700} size="lg">
                                    <Text c="cyan" component="span" fw={700}>
                                        Remna
                                    </Text>
                                    wave
                                </Text>
                            </Group>
                            {buildInfo.branch === 'dev' && (
                                <Indicator
                                    color="cyan.6"
                                    disabled={!isNewVersionAvailable}
                                    offset={3}
                                    processing
                                    size={11}
                                >
                                    <Badge
                                        color="red"
                                        onClick={() => setBuildInfoModalOpened(true)}
                                        radius="xl"
                                        size="lg"
                                        style={{ cursor: 'help', marginLeft: 'auto' }}
                                        variant="light"
                                    >
                                        dev
                                    </Badge>
                                </Indicator>
                            )}

                            {buildInfo.branch !== 'dev' && (
                                <Indicator
                                    color="cyan.6"
                                    disabled={!isNewVersionAvailable}
                                    offset={3}
                                    processing
                                    size={11}
                                >
                                    <Badge
                                        color="cyan"
                                        onClick={() => setBuildInfoModalOpened(true)}
                                        radius="xl"
                                        size="lg"
                                        style={{ cursor: 'pointer', marginLeft: 'auto' }}
                                        variant="light"
                                    >
                                        {`${packageJson.version}`}
                                    </Badge>
                                </Indicator>
                            )}

                            {isSocialButton && (
                                <Group style={{ flexShrink: 0 }}>
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
                        </Group>
                    </Group>
                </AppShell.Section>
                <AppShell.Section
                    component={ScrollArea}
                    flex={1}
                    offsetScrollbars="present"
                    scrollbarSize={'0.4rem'}
                    type="hover"
                >
                    <Navigation isMobile={isMobile} onClose={toggleMobile} />
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main
                style={{
                    height: '100dvh'
                }}
            >
                <Outlet />
            </AppShell.Main>

            <BuildInfoModal
                buildInfo={buildInfo}
                isNewVersionAvailable={isNewVersionAvailable}
                onClose={() => setBuildInfoModalOpened(false)}
                opened={buildInfoModalOpened}
            />
        </AppShell>
    ) : (
        <div style={{ height: '100vh' }}></div>
    )
}
