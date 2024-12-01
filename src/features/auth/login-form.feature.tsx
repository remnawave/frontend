import { Button, Container, Paper, PasswordInput, TextInput } from '@mantine/core'
import { LoginCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { PiSignInDuotone } from 'react-icons/pi'

import { useAuth } from '@shared/hooks/use-auth'

import {
    useAuthStoreIsLoading,
    useLoginPageStoreActions
} from '../../entitites/auth/auth-store/auth-store'
import { handleFormErrors } from '../../shared/utils/form'

export const LoginForm = () => {
    const { setIsAuthenticated } = useAuth()
    const { login } = useLoginPageStoreActions()
    const isLoading = useAuthStoreIsLoading()

    const form = useForm({
        mode: 'uncontrolled',
        validate: zodResolver(LoginCommand.RequestSchema),
        initialValues: { username: '', password: '' }
    })

    const handleSubmit = form.onSubmit(async (variables) => {
        try {
            await login({ username: variables.username, password: variables.password })
            setIsAuthenticated(true)
        } catch (error) {
            handleFormErrors(form, error)
        }
    })

    return (
        <form onSubmit={handleSubmit}>
            <Container my={40} size={'100%'}>
                <Paper mt={30} p={30}>
                    <TextInput
                        label="Username"
                        name="username"
                        placeholder="username"
                        required
                        {...form.getInputProps('username')}
                    />
                    <PasswordInput
                        label="Password"
                        mt="md"
                        name="password"
                        placeholder="Your password"
                        required
                        {...form.getInputProps('password')}
                    />
                    <Button
                        fullWidth
                        leftSection={<PiSignInDuotone size="1rem" />}
                        loading={isLoading}
                        mt="xl"
                        type="submit"
                    >
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </form>
    )
}
