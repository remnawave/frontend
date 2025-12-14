import {
    ActionIcon,
    Box,
    Button,
    Code,
    Divider,
    Group,
    HoverCard,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import {
    GetRemnawaveSettingsCommand,
    UpdateRemnawaveSettingsCommand
} from '@remnawave/backend-contract'
import { TbAlertCircle, TbLink, TbStar } from 'react-icons/tb'
import { zodResolver } from 'mantine-form-zod-resolver'
import { HiQuestionMarkCircle } from 'react-icons/hi'
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
                                {t('common.close')}
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

    const brandingTitleHoverCard = () => {
        return (
            <HoverCard shadow="md" width={350} withArrow>
                <HoverCard.Target>
                    <ActionIcon color="gray" size="xs" variant="subtle">
                        <HiQuestionMarkCircle size={20} />
                    </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Stack gap="md">
                        <Stack gap="sm">
                            <Stack gap={4}>
                                <Text fw={600} size="sm">
                                    {t('branding-settings-card.widget.colored-title-format')}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {t('branding-settings-card.widget.colored-title-description')}
                                </Text>
                            </Stack>

                            <Divider />

                            <Stack gap={8}>
                                <Box>
                                    <Text c="dimmed" fw={500} mb={4} size="xs">
                                        {t('branding-settings-card.widget.example-hex-colors')}:
                                    </Text>
                                    <Code block c="blue" fz="xs">
                                        {'{#B8F2E6}Re{#FFA69E}mna{#AEC6CF}wave'}
                                    </Code>
                                </Box>

                                <Box>
                                    <Text c="dimmed" fw={500} mb={4} size="xs">
                                        {t('branding-settings-card.widget.example-mantine-colors')}:
                                    </Text>
                                    <Code block c="blue" fz="xs">
                                        {'{cyan}Remna{white}wave'}
                                    </Code>
                                </Box>

                                <Box>
                                    <Text c="dimmed" fw={500} mb={4} size="xs">
                                        {t('branding-settings-card.widget.example-mixed')}:
                                    </Text>
                                    <Code block c="blue" fz="xs">
                                        {'{#B8F2E6}Re{#FFA69E}mna{cyan}wave'}
                                    </Code>
                                </Box>
                            </Stack>

                            <Divider />

                            <Box>
                                <Text c="dimmed" size="xs">
                                    {t('branding-settings-card.widget.color-format-note')}
                                </Text>
                            </Box>
                        </Stack>
                    </Stack>
                </HoverCard.Dropdown>
            </HoverCard>
        )
    }

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
                                rightSection={brandingTitleHoverCard()}
                                {...form.getInputProps('brandingSettings.title')}
                            />

                            <TextInput
                                description={t(
                                    'branding-settings-card.widget.the-url-to-your-brand-logo-image'
                                )}
                                key={form.key('brandingSettings.logoUrl')}
                                label={t('branding-settings-card.widget.logo-url')}
                                leftSection={<TbLink size={16} />}
                                placeholder="https://example.com/logo.png"
                                {...form.getInputProps('brandingSettings.logoUrl')}
                            />
                        </Stack>
                    </SettingsCardShared.Content>

                    <SettingsCardShared.Bottom>
                        <Group justify="flex-end">
                            <Button color="teal" loading={isUpdatePending} size="md" type="submit">
                                {t('common.save')}
                            </Button>
                        </Group>
                    </SettingsCardShared.Bottom>
                </SettingsCardShared.Container>
            </form>
        </>
    )
}
