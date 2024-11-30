import { Box, Group, Stack, Text, Title } from '@mantine/core'
import { Page } from '@shared/ui/page'
import { UnderlineShape } from '@shared/ui/underline-shape'
import { Logo } from '@/shared/ui/logo'
import { LoginForm } from '../../../features/auth'

export const LoginPage = () => {
    return (
        <Page title="Login">
            <Stack gap="xl" align="center">
                <Group justify="center" align="center">
                    <Logo size="2.5rem" c="red" />
                    <Title order={1}>
                        <Text fz="inherit" fw="inherit" component="span" pos="relative">
                            Remnawave
                            <UnderlineShape
                                c="red"
                                w="7rem"
                                left="0"
                                pos="absolute"
                                h="0.625rem"
                                bottom="-1rem"
                            />
                        </Text>
                    </Title>
                </Group>

                <Box w={{ base: 440, sm: 500, md: 500 }} maw={800}>
                    <LoginForm />
                </Box>
            </Stack>
        </Page>
    )
}

export default LoginPage
