import { Button, Container, Paper, PasswordInput, TextInput } from '@mantine/core'
import { LoginCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { PiSignInDuotone } from 'react-icons/pi'
import MD5 from 'crypto-js/md5'

import { useAuth } from '@shared/hooks/use-auth'
import { useLogin } from '@/shared/api/hooks'

import { handleFormErrors } from '../../shared/utils/form'

export const LoginForm = () => {
    const { setIsAuthenticated } = useAuth()

    const form = useForm({
        mode: 'uncontrolled',
        validate: zodResolver(LoginCommand.RequestSchema),
        initialValues: { username: '', password: '' }
    })

    const { mutate: login, isPending: isLoading } = useLogin()

    const handleSubmit = form.onSubmit((variables) => {
        login(
            {
                variables: {
                    username: variables.username,
                    password: MD5(variables.password).toString()
                }
            },
            {
                onSuccess: () => {
                    setIsAuthenticated(true)
                },
                onError: (error) => handleFormErrors(form, error)
            }
        )
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
