import {
    AppShell,
    Badge,
    Box,
    Burger,
    Button,
    Container,
    Group,
    Image,
    Indicator,
    ScrollArea,
    Text
} from '@mantine/core'
import { useClickOutside, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Outlet, useNavigate } from 'react-router-dom'
import { PiGameController } from 'react-icons/pi'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import semver from 'semver'
import axios from 'axios'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'
import { ScrollToTopWrapper } from '@shared/hocs/scroll-to-top/scroll-to-top'
import { BuildInfoModal } from '@shared/ui/build-info-modal/build-info-modal'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { HeaderControls } from '@shared/ui/header-buttons'
import { sToMs } from '@shared/utils/time-utils'
import { ROUTES } from '@shared/constants'
import { LoadingScreen } from '@shared/ui'
import { Logo } from '@shared/ui/logo'

import { Navigation } from './navbar/navigation.layout'
import packageJson from '../../../../../package.json'
import classes from './Main.module.css'

export function MainLayout() {
    const { data: authStatus, isFetching } = useGetAuthStatus()

    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)
    const [isMediaQueryReady, setIsMediaQueryReady] = useState(false)

    const navigate = useNavigate()
    const { incrementClick, isEasterEggUnlocked, isGameModalOpen, closeGameModal } =
        useEasterEggStore()

    const [versions, setVersions] = useState<{
        currentVersion: string
        latestVersion: string
    }>({
        currentVersion: '0.0.0',
        latestVersion: '0.0.0'
    })
    const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false)
    const [isLogoAnimating, setIsLogoAnimating] = useState(false)

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

    if (isFetching) {
        return <LoadingScreen height="100vh" />
    }

    const handleClick = () => {
        if (isEasterEggUnlocked) {
            navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)
            return
        }

        incrementClick()

        setIsLogoAnimating(true)
        setTimeout(() => {
            setIsLogoAnimating(false)
        }, 100)
    }

    const logoElement = !isEasterEggUnlocked ? (
        <Logo
            c={isLogoAnimating ? 'pink' : 'cyan'}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    ) : (
        <Logo
            c="pink"
            onClick={() => {
                navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)
            }}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    )

    const titleElement = (
        <Text
            fw={700}
            size="lg"
            style={{
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
        >
            <Text
                c={isEasterEggUnlocked || isLogoAnimating ? 'pink' : 'cyan'}
                component="span"
                fw={700}
            >
                Remna
            </Text>
            wave
        </Text>
    )

    const versionBadge =
        buildInfo.branch === 'dev' ? (
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
                    style={{ cursor: 'help' }}
                    variant="light"
                >
                    dev
                </Badge>
            </Indicator>
        ) : (
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
                    style={{ cursor: 'pointer' }}
                    variant="light"
                >
                    {`${packageJson.version}`}
                </Badge>
            </Indicator>
        )

    const customLogo = () => {
        if (!authStatus?.branding.logoUrl) {
            return logoElement
        }

        return (
            <Image
                alt="logo"
                fallbackSrc="/favicons/logo.svg"
                fit="contain"
                onClick={handleClick}
                src={authStatus.branding.logoUrl}
                style={{
                    maxWidth: '30px',
                    maxHeight: '30px',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                }}
            />
        )
    }

    const customTitle = () => {
        if (!authStatus?.branding.title) {
            return titleElement
        }

        return (
            <Text
                fw={700}
                size="lg"
                style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
            >
                {authStatus.branding.title}
            </Text>
        )
    }

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
                        {customLogo()}
                        {customTitle()}
                        {!isMobile && versionBadge}
                    </Group>

                    {isMobile && (
                        <Group gap="xs" justify="center">
                            {versionBadge}
                        </Group>
                    )}

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
                <AppShell.Section
                    component={ScrollArea}
                    flex={1}
                    offsetScrollbars="present"
                    scrollbarSize={'0.2rem'}
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
                <ScrollToTopWrapper>
                    <Outlet />
                </ScrollToTopWrapper>
            </AppShell.Main>

            <BuildInfoModal
                buildInfo={buildInfo}
                isNewVersionAvailable={isNewVersionAvailable}
                onClose={() => setBuildInfoModalOpened(false)}
                opened={buildInfoModalOpened}
            />

            {isGameModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--mantine-color-dark-8)',
                            border: '1px solid var(--mantine-color-gray-6)',
                            padding: '2rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Text fw={700} mb="md" size="xl">
                            🎉 Easter Egg Found
                        </Text>
                        <Text mb="md">You've discovered the hidden Proxy Defense game!</Text>
                        <Group gap="md" justify="center">
                            <Button onClick={closeGameModal} size="md" variant="light">
                                Close
                            </Button>
                            <Button
                                leftSection={<PiGameController size={22} />}
                                onClick={() => {
                                    closeGameModal()
                                    navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)
                                }}
                                size="md"
                            >
                                Play Game
                            </Button>
                        </Group>
                    </div>
                </div>
            )}
        </AppShell>
    ) : (
        <div style={{ height: '100vh' }}></div>
    )
}
