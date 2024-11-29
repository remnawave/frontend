import { Button, Container, Paper, PasswordInput, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { LoginCommand } from '@remnawave/backend-contract'
import { useAuth } from '@shared/hooks/use-auth'
import { PiSignInDuotone, PiSignOutDuotone } from 'react-icons/pi'
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
            <Container size={'100%'} my={40}>
                <Paper p={30} mt={30}>
                    <TextInput
                        name="username"
                        label="Username"
                        placeholder="username"
                        required
                        {...form.getInputProps('username')}
                    />
                    <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <Button
                        fullWidth
                        mt="xl"
                        type="submit"
                        leftSection={<PiSignInDuotone size="1rem" />}
                        loading={isLoading}
                    >
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </form>
    )
}
