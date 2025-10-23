import {
    GetRemnawaveSettingsCommand,
    UpdateRemnawaveSettingsCommand
} from '@remnawave/backend-contract'
import { Button, Code, Group, Stack, Text, TextInput, ThemeIcon } from '@mantine/core'
import { TbAlertCircle, TbLink, TbStar } from 'react-icons/tb'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'

import { useUpdateRemnawaveSettings } from '@shared/api/hooks/remnawave-settings/remnawave-settings.mutation.hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'
import { Logo } from '@shared/ui'

interface IProps {
    brandingSettings: NonNullable<
        GetRemnawaveSettingsCommand.Response['response']['brandingSettings']
    >
}

export const BrandingSettingsCardWidget = (props: IProps) => {
    const { brandingSettings } = props
    const { t } = useTranslation()

    const form = useForm<NonNullable<UpdateRemnawaveSettingsCommand.Request>>({
        name: 'branding-settings',
        mode: 'uncontrolled',
        onValuesChange: (values) => {
            if (
                values.brandingSettings &&
                typeof values.brandingSettings.logoUrl === 'string' &&
                values.brandingSettings.logoUrl === ''
            ) {
                form.setFieldValue('brandingSettings.logoUrl', null)
            }
        },
        validate: zodResolver(
            UpdateRemnawaveSettingsCommand.RequestSchema.pick({
                brandingSettings: true
            })
        ),
        initialValues: {
            brandingSettings
        }
    })

    const { mutate: updateSettings, isPending: isUpdatePending } = useUpdateRemnawaveSettings({
        mutationFns: {
            onSuccess() {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.remnawaveSettings.getRemnawaveSettings.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: QueryKeys.auth.getAuthStatus.queryKey
                })
            },
            onError(error) {
                handleFormErrors(form, error)

                modals.open({
                    title: (
                        <Group gap="sm">
                            <ThemeIcon color="red" radius="xl" size="lg" variant="light">
                                <TbAlertCircle size={24} />
                            </ThemeIcon>
                            <Text fw={600} size="lg">
                                {t('auth-settings.error-modal.title')}
                            </Text>
                        </Group>
                    ),
                    centered: true,
                    children: (
                        <Stack gap="md">
                            <Text c="dimmed" size="sm">
                                {t('auth-settings.error-modal.description')}
                            </Text>
                            <Code p="md">
                                <Text c="red.1" fw={500} size="sm">
                                    {error instanceof Error
                                        ? error.message
                                        : t('auth-settings.error-modal.unknown-error')}
                                </Text>
                            </Code>
                            <Button
                                color="red"
                                fullWidth
                                onClick={() => modals.closeAll()}
                                variant="light"
                            >
                                {t('auth-settings.error-modal.close-button')}
                            </Button>
                        </Stack>
                    )
                })
            }
        }
    })

    const handleSubmit = form.onSubmit((values) => {
        updateSettings({
            variables: {
                brandingSettings: values.brandingSettings
            }
        })
    })

    return (
        <>
            <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                <SettingsCardShared.Container>
                    <SettingsCardShared.Header
                        description={t(
                            'branding-settings-card.widget.customize-your-remnawave-instance'
                        )}
                        icon={<Logo size={24} />}
                        title={t('branding-settings-card.widget.branding-settings')}
                    />

                    <SettingsCardShared.Content>
                        <Stack gap="md">
                            <TextInput
                                description={t(
                                    'branding-settings-card.widget.the-title-that-will-be-displayed-on-login-page'
                                )}
                                key={form.key('brandingSettings.title')}
                                label={t('branding-settings-card.widget.brand-name')}
                                leftSection={<TbStar size={16} />}
                                placeholder="Remnawave"
                                {...form.getInputProps('brandingSettings.title')}
                            />

                            <TextInput
                                description={t(
                                    'branding-settings-card.widget.the-url-to-your-brand-logo-image'
                                )}
                                key={form.key('brandingSettings.logoUrl')}
                                label={t('branding-settings.component.logo-url')}
                                leftSection={<TbLink size={16} />}
                                placeholder="https://example.com/logo.png"
                                {...form.getInputProps('brandingSettings.logoUrl')}
                            />
                        </Stack>
                    </SettingsCardShared.Content>

                    <SettingsCardShared.Bottom>
                        <Group justify="flex-end">
                            <Button color="teal" loading={isUpdatePending} size="md" type="submit">
                                {t('branding-settings-card.widget.save')}
                            </Button>
                        </Group>
                    </SettingsCardShared.Bottom>
                </SettingsCardShared.Container>
            </form>
        </>
    )
}
