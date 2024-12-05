import { Box, Group, Stack, Text, Title } from '@mantine/core'

import { UnderlineShape } from '@shared/ui/underline-shape'
import { Logo } from '@/shared/ui/logo'
import { Page } from '@shared/ui/page'

import { LoginForm } from '../../../features/auth'

export const LoginPage = () => {
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

                <Box maw={800} w={{ base: 440, sm: 500, md: 500 }}>
                    <LoginForm />
                </Box>
            </Stack>
        </Page>
    )
}

export default LoginPage
