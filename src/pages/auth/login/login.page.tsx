import { Badge, Box, Center, Divider, Group, Image, Loader, Stack, Text, Title } from '@mantine/core'
import { GetStatusCommand } from '@remnawave/backend-contract'
import { useEffect, useMemo, useRef, useState } from 'react'
import { notifications } from '@mantine/notifications'

import { TelegramLoginButtonFeature } from '@features/auth/telegram-login-button/telegram-login-button.feature'
import { OAuth2LoginButtonsFeature } from '@features/auth/oauth2-login-button/oauth2-login-button.feature'
import { PasskeyLoginButtonFeature } from '@features/auth/passkey-login-button'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { RegisterFormFeature } from '@features/auth/register-form'
import { LoginFormFeature } from '@features/auth/login-form'
import { parseColoredTextUtil } from '@shared/utils/misc'
import { useOAuth2Authorize } from '@shared/api/hooks'
import { Logo, Page } from '@shared/ui'

const getAuthMethods = (authStatus: GetStatusCommand.Response['response'] | undefined) => {
    const isPasswordEnabled = authStatus?.authentication?.password?.enabled ?? false
    const isPasskeyEnabled = authStatus?.authentication?.passkey?.enabled ?? false
    const isTelegramEnabled = authStatus?.authentication?.tgAuth?.enabled ?? false
    const isOAuth2Enabled =
        Object.values(authStatus?.authentication?.oauth2?.providers ?? {}).some(Boolean) ?? false

    return {
        isOAuth2Enabled,
        isPasskeyEnabled,
        isPasswordEnabled,
        isTelegramEnabled,
        hasAlternativeMethods: isPasskeyEnabled || isTelegramEnabled || isOAuth2Enabled,
        hasPrimaryMethods: isPasswordEnabled
    }
}

const BrandLogo = ({ logoUrl }: { logoUrl?: null | string }) => {
    if (!logoUrl) {
        return <Logo c="cyan" w="3rem" />
    }

    return (
        <Image
            alt="logo"
            fit="contain"
            src={logoUrl}
            style={{
                maxWidth: '40px',
                maxHeight: '40px',
                width: '40px',
                height: '40px'
            }}
        />
    )
}

const BrandTitle = ({ titleParts }: { titleParts: Array<{ color: string; text: string }> }) => {
    return (
        <Title ff="Unbounded" order={1} pos="relative">
            {titleParts.map((part, index) => (
                <Text
                    c={part.color || 'white'}
                    component="span"
                    fw="inherit"
                    fz="inherit"
                    inherit
                    key={index}
                    pos="relative"
                >
                    {part.text}
                </Text>
            ))}
        </Title>
    )
}

const AlternativeAuthMethods = ({
    authentication,
    isOAuth2Enabled,
    isPasskeyEnabled,
    isPasswordEnabled,
    isTelegramEnabled
}: {
    authentication: GetStatusCommand.Response['response']['authentication']
    isOAuth2Enabled: boolean
    isPasskeyEnabled: boolean
    isPasswordEnabled: boolean
    isTelegramEnabled: boolean
}) => (
    <Center>
        <Stack gap="md" maw={isPasswordEnabled ? 300 : 150} w="100%">
            {isPasskeyEnabled && authentication && (
                <PasskeyLoginButtonFeature authentication={authentication} />
            )}
            {isTelegramEnabled && authentication && (
                <TelegramLoginButtonFeature authentication={authentication} />
            )}
            {isOAuth2Enabled && authentication && (
                <OAuth2LoginButtonsFeature authentication={authentication} />
            )}
        </Stack>
    </Center>
)

const SEAMLESS_AUTH_KEY = 'keycloak_seamless_attempted'

export const LoginPage = () => {
    const { data: authStatus } = useGetAuthStatus()
    const [isSeamlessRedirecting, setIsSeamlessRedirecting] = useState(false)
    const seamlessAttempted = useRef(false)

    const { mutate: oauth2Authorize } = useOAuth2Authorize({
        mutationFns: {
            onSuccess: (data) => {
                if (data.authorizationUrl) {
                    sessionStorage.setItem(SEAMLESS_AUTH_KEY, 'true')
                    window.location.assign(data.authorizationUrl)
                }
            },
            onError: (error) => {
                setIsSeamlessRedirecting(false)
                sessionStorage.removeItem(SEAMLESS_AUTH_KEY)
                notifications.show({
                    title: 'Keycloak Authentication',
                    message: error.message || 'Seamless authentication failed',
                    color: 'red'
                })
            }
        }
    })

    // Seamless Keycloak authentication
    useEffect(() => {
        if (seamlessAttempted.current) return
        if (!authStatus?.authentication?.oauth2?.providers?.keycloak) return
        if (!authStatus?.authentication?.oauth2?.keycloakSeamlessAuth) return

        // Check if we already attempted seamless auth in this session
        const alreadyAttempted = sessionStorage.getItem(SEAMLESS_AUTH_KEY)
        if (alreadyAttempted) {
            sessionStorage.removeItem(SEAMLESS_AUTH_KEY)
            return
        }

        seamlessAttempted.current = true
        setIsSeamlessRedirecting(true)
        oauth2Authorize({
            variables: {
                provider: 'keycloak'
            }
        })
    }, [authStatus, oauth2Authorize])

    const titleParts = useMemo(() => {
        if (authStatus?.branding.title) {
            return parseColoredTextUtil(authStatus.branding.title)
        }

        return [
            { text: 'Remna', color: 'cyan' },
            { text: 'wave', color: 'white' }
        ]
    }, [authStatus?.branding.title])

    const isRegister = !authStatus?.isLoginAllowed && authStatus?.isRegisterAllowed
    const authMethods = getAuthMethods(authStatus)

    // Show loading while seamless auth is in progress
    if (isSeamlessRedirecting) {
        return (
            <Page title="Login">
                <Center style={{ minHeight: '60vh' }}>
                    <Stack align="center" gap="md">
                        <Loader size="xl" variant="dots" />
                        <Text c="dimmed">Redirecting to Keycloak...</Text>
                    </Stack>
                </Center>
            </Page>
        )
    }

    return (
        <Page title="Login">
            <Stack align="center" gap="xs">
                <Group align="center" gap={4} justify="center">
                    <BrandLogo logoUrl={authStatus?.branding.logoUrl} />
                    <BrandTitle titleParts={titleParts} />
                </Group>

                {!authStatus && (
                    <Badge color="cyan" mt={10} size="lg" variant="filled">
                        Server is not responding. Check logs.
                    </Badge>
                )}

                {!isRegister && authStatus && authStatus.authentication && (
                    <Box maw={800} p={30} w={{ base: 440, sm: 500, md: 500 }}>
                        <Stack gap="lg">
                            {authMethods.isPasswordEnabled && <LoginFormFeature />}

                            {authMethods.hasPrimaryMethods && authMethods.hasAlternativeMethods && (
                                <Center>
                                    <Divider
                                        label="OR"
                                        labelPosition="center"
                                        maw="400px"
                                        w="100%"
                                    />
                                </Center>
                            )}

                            {authMethods.hasAlternativeMethods && (
                                <AlternativeAuthMethods
                                    authentication={authStatus.authentication}
                                    isOAuth2Enabled={authMethods.isOAuth2Enabled}
                                    isPasskeyEnabled={authMethods.isPasskeyEnabled}
                                    isPasswordEnabled={authMethods.isPasswordEnabled}
                                    isTelegramEnabled={authMethods.isTelegramEnabled}
                                />
                            )}
                        </Stack>
                    </Box>
                )}

                {isRegister && (
                    <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                        <RegisterFormFeature />
                    </Box>
                )}
            </Stack>
        </Page>
    )
}

export default LoginPage
