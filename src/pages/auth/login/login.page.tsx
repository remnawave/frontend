import { Badge, Box, Center, Group, Image, Stack, Text, Title } from '@mantine/core'
import { useLayoutEffect } from 'react'

import { TelegramLoginButtonFeature } from '@features/auth/telegram-login-button/telegram-login-button.feature'
import { OAuth2LoginButtonsFeature } from '@features/auth/oauth2-login-button/oauth2-login-button.feature'
import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { RegisterFormFeature } from '@features/auth/register-form'
import { LoginFormFeature } from '@features/auth/login-form'
import { clearQueryClient } from '@shared/api/query-client'
import { LoadingScreen } from '@shared/ui'
import { Logo } from '@shared/ui/logo'
import { Page } from '@shared/ui/page'

export const LoginPage = () => {
    const { data: authStatus, isFetching } = useGetAuthStatus()

    useLayoutEffect(() => {
        clearQueryClient()
    }, [])

    if (isFetching) {
        return <LoadingScreen height="60vh" />
    }

    const isOAuth2 = Object.values(authStatus?.oauth2?.providers || {}).some(Boolean)

    const isSimpleLogin =
        authStatus?.isLoginAllowed &&
        !authStatus?.isRegisterAllowed &&
        !isOAuth2 &&
        !authStatus?.tgAuth

    const isTelegramLogin =
        authStatus?.isLoginAllowed && !authStatus?.isRegisterAllowed && authStatus?.tgAuth

    const isOAuth2Login = authStatus?.isLoginAllowed && !authStatus?.isRegisterAllowed && isOAuth2

    const isRegister = !authStatus?.isLoginAllowed && authStatus?.isRegisterAllowed

    const customLogo = () => {
        if (!authStatus?.branding.logoUrl) {
            return <Logo c="cyan" w="3rem" />
        }

        return (
            <Image
                alt="logo"
                fit="contain"
                src={authStatus.branding.logoUrl}
                style={{
                    maxWidth: '40px',
                    maxHeight: '40px',
                    width: '40px',
                    height: '40px'
                }}
            />
        )
    }

    const customTitle = () => {
        if (!authStatus?.branding.title) {
            return (
                <Title order={1} pos="relative">
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
            <Title order={1} pos="relative">
                <Text c="white" component="span" fw="inherit" fz="inherit" pos="relative">
                    {authStatus.branding.title}
                </Text>
            </Title>
        )
    }

    return (
        <Page title="Login">
            <Stack align="center" gap="xs">
                <Group align="center" gap={4} justify="center">
                    {customLogo()}
                    {customTitle()}
                </Group>

                {!authStatus && (
                    <Badge color="cyan" mt={10} size="lg" variant="filled">
                        Server is not responding. Check logs.
                    </Badge>
                )}

                {isSimpleLogin && (
                    <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                        <LoginFormFeature />
                    </Box>
                )}

                {(isTelegramLogin || isOAuth2Login) && (
                    <Center maw={800} mt={20}>
                        <Stack>
                            {isTelegramLogin && (
                                <TelegramLoginButtonFeature tgAuth={authStatus.tgAuth} />
                            )}
                            {isOAuth2Login && (
                                <OAuth2LoginButtonsFeature oauth2={authStatus.oauth2} />
                            )}
                        </Stack>
                    </Center>
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
