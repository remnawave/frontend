import { Button, Container, Paper, PasswordInput, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { LoginCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiSignInDuotone } from 'react-icons/pi'

import { useLogin } from '@shared/api/hooks'
import { useAuth } from '@shared/hooks/use-auth'
import { handleFormErrors } from '@shared/utils/misc'

export const LoginFormFeature = () => {
    const { t } = useTranslation()

    const { setIsAuthenticated } = useAuth()

    const form = useForm({
        mode: 'uncontrolled',
        validate: schemaResolver(LoginCommand.RequestBodySchema),
        initialValues: { username: '', password: '' }
    })

    const { mutate: login, isPending: isLoading } = useLogin()

    const handleSubmit = form.onSubmit((variables) => {
        login(
            {
                variables: {
                    username: variables.username,
                    password: variables.password
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
            <Container size="100%">
                <Paper>
                    <TextInput
                        label={t('common.field.username')}
                        name="username"
                        placeholder={t('common.field.username')}
                        required
                        {...form.getInputProps('username')}
                    />
                    <PasswordInput
                        label={t('common.field.password')}
                        mt="md"
                        name="password"
                        placeholder={t('login-form.feature.your-password')}
                        required
                        {...form.getInputProps('password')}
                    />
                    <Button
                        fullWidth
                        leftSection={<PiSignInDuotone size="16px" />}
                        loading={isLoading}
                        mt="xl"
                        type="submit"
                        variant="default"
                    >
                        {t('login-form.feature.sign-in')}
                    </Button>
                </Paper>
            </Container>
        </form>
    )
}
