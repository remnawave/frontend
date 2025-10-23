import { Badge, Box, Center, Divider, Group, Image, Stack, Text, Title } from '@mantine/core'
import { GetStatusCommand } from '@remnawave/backend-contract'
import { useLayoutEffect } from 'react'

import { TelegramLoginButtonFeature } from '@features/auth/telegram-login-button/telegram-login-button.feature'
import { OAuth2LoginButtonsFeature } from '@features/auth/oauth2-login-button/oauth2-login-button.feature'
import { PasskeyLoginButtonFeature } from '@features/auth/passkey-login-button'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { RegisterFormFeature } from '@features/auth/register-form'
import { LoginFormFeature } from '@features/auth/login-form'
import { clearQueryClient } from '@shared/api/query-client'
import { LoadingScreen } from '@shared/ui'
import { Logo } from '@shared/ui/logo'
import { Page } from '@shared/ui/page'

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

const BrandTitle = ({ title }: { title?: null | string }) => {
    if (!title) {
        return (
            <Title ff="Unbounded" order={1} pos="relative">
                <Text c="cyan" component="span" fw="inherit" fz="inherit" pos="relative">
                    Remna
                </Text>
                <Text c="white" component="span" fw="inherit" fz="inherit" pos="relative">
                    wave
                </Text>
            </Title>
        )
    }

    return (
        <Title ff="Unbounded" order={1} pos="relative">
            <Text c="white" component="span" fw="inherit" fz="inherit" pos="relative">
                {title}
            </Text>
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

export const LoginPage = () => {
    const { data: authStatus, isFetching } = useGetAuthStatus()

    useLayoutEffect(() => {
        clearQueryClient()
    }, [])

    if (isFetching) {
        return <LoadingScreen height="60vh" />
    }

    const isRegister = !authStatus?.isLoginAllowed && authStatus?.isRegisterAllowed
    const authMethods = getAuthMethods(authStatus)

    return (
        <Page title="Login">
            <Stack align="center" gap="xs">
                <Group align="center" gap={4} justify="center">
                    <BrandLogo logoUrl={authStatus?.branding.logoUrl} />
                    <BrandTitle title={authStatus?.branding.title} />
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
