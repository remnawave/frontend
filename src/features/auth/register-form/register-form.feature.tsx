import {
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core'
import { PiShuffleDuotone, PiSignpostDuotone } from 'react-icons/pi'
import { RegisterCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { generate } from 'generate-password-ts'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { useEffect } from 'react'

import { handleFormErrors } from '@shared/utils/misc'
import { useAuth } from '@shared/hooks/use-auth'
import { useRegister } from '@shared/api/hooks'

export const RegisterFormFeature = () => {
    const { t } = useTranslation()

    const { setIsAuthenticated } = useAuth()

    const { copy, copied, error } = useClipboard()

    const form = useForm({
        validate: {
            ...zodResolver(RegisterCommand.RequestSchema),
            confirmPassword: (value, values) =>
                value !== values.password
                    ? t('register-form.feature.passwords-do-not-match')
                    : null,
            password: (value) =>
                value.length < 12 ? t('register-form.feature.password-too-short') : null
        },
        initialValues: {
            username: '',
            password: '',
            confirmPassword: ''
        }
    })

    const { mutate: register, isPending: isLoading } = useRegister({
        mutationFns: {
            onSuccess: () => setIsAuthenticated(true),
            onError: (error) => {
                handleFormErrors(form, error)
            }
        }
    })

    const handleGeneratePassword = () => {
        const newPassword = generate({
            length: 32,
            numbers: true,
            symbols: false,
            uppercase: true,
            lowercase: true,
            strict: true
        })

        form.setValues({
            ...form.values,
            password: newPassword,
            confirmPassword: newPassword
        })

        copy(newPassword)
    }

    useEffect(() => {
        if (error) {
            notifications.show({
                title: t('register-form.feature.error'),
                message: t('register-form.feature.password-copied-error')
            })
        }

        if (copied) {
            notifications.show({
                title: t('register-form.feature.password-copied'),
                message: t('register-form.feature.password-copied-message')
            })
        }
    }, [error, copied])

    const handleSubmit = form.onSubmit((variables) => {
        register({
            variables: {
                username: variables.username,
                password: variables.password
            }
        })
    })

    return (
        <form onSubmit={handleSubmit}>
            <Container my={40} size={'100%'}>
                <Paper mt={30} p={30} radius="md">
                    <Title mb="xs" order={2} ta="center">
                        {t('register-form.feature.registration')}
                    </Title>
                    <Text c="dimmed" mb="md" size="sm" ta="center">
                        {t('register-form.feature.register-description')}
                    </Text>

                    <TextInput
                        label={t('register-form.feature.username')}
                        placeholder="IamSuperAdmin"
                        required
                        size="md"
                        {...form.getInputProps('username')}
                    />

                    <Stack mt="md">
                        <PasswordInput
                            label={t('register-form.feature.password')}
                            placeholder="soy_t5Px5`Gm4j0@Hf&Dd7iU"
                            required
                            size="md"
                            style={{ flex: 1 }}
                            {...form.getInputProps('password')}
                        />

                        <PasswordInput
                            label={t('register-form.feature.confirm-password')}
                            mt="md"
                            placeholder="soy_t5Px5`Gm4j0@Hf&Dd7iU"
                            required
                            size="md"
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Button
                            fullWidth
                            leftSection={<PiShuffleDuotone size="16px" />}
                            mt="xl"
                            onClick={handleGeneratePassword}
                            size="md"
                            variant="light"
                        >
                            {t('register-form.feature.generate')}
                        </Button>
                    </Stack>

                    <Button
                        fullWidth
                        leftSection={<PiSignpostDuotone size="16px" />}
                        loading={isLoading}
                        mt="xl"
                        size="md"
                        type="submit"
                    >
                        {t('register-form.feature.sign-up')}
                    </Button>
                </Paper>
            </Container>
        </form>
    )
}
