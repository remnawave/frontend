import { Badge, Box, Group, Loader, Stack, Text, Title } from '@mantine/core'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { RegisterFormFeature } from '@features/auth/register-form'
import { LoginFormFeature } from '@features/auth/login-form'
import { UnderlineShape } from '@shared/ui/underline-shape'
import { Logo } from '@shared/ui/logo'
import { Page } from '@shared/ui/page'

export const LoginPage = () => {
    const { data: authStatus, isLoading } = useGetAuthStatus()

    if (isLoading) {
        return <Loader />
    }

    return (
        <Page title="Login">
            <Stack align="center" gap="xl">
                <Group align="center" justify="center">
                    <Logo c="cyan" w="3rem" />
                    <Title order={1}>
                        <Text component="span" fw="inherit" fz="inherit" pos="relative">
                            Remnawave
                            <UnderlineShape
                                bottom="-1rem"
                                c="cyan"
                                h="0.625rem"
                                left="0"
                                pos="absolute"
                                w="7.852rem"
                            />
                        </Text>
                    </Title>
                </Group>

                {!authStatus && (
                    <Badge color="cyan" mt={10} size="lg" variant="filled">
                        Server is not responding. Check logs.
                    </Badge>
                )}

                {authStatus?.isLoginAllowed && !authStatus?.isRegisterAllowed && (
                    <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                        <LoginFormFeature />
                    </Box>
                )}

                {!authStatus?.isLoginAllowed && authStatus?.isRegisterAllowed && (
                    <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                        <RegisterFormFeature />
                    </Box>
                )}
            </Stack>
        </Page>
    )
}

export default LoginPage
