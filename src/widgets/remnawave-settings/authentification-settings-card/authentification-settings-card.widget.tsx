import {
    Accordion,
    Box,
    Button,
    Center,
    Code,
    Group,
    Stack,
    Switch,
    TagsInput,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import {
    GetRemnawaveSettingsCommand,
    UpdateRemnawaveSettingsCommand
} from '@remnawave/backend-contract'
import { TbAlertCircle, TbFingerprint, TbPassword, TbServer } from 'react-icons/tb'
import { BiLogoGithub, BiLogoTelegram } from 'react-icons/bi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { PiGlobe, PiKey } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { TFunction } from 'i18next'

import { PasskeysDrawerComponent } from '@widgets/remnawave-settings/passkeys-settings-drawer/passkeys-drawer.component'
import { useUpdateRemnawaveSettings } from '@shared/api/hooks/remnawave-settings/remnawave-settings.mutation.hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { YandexLogo } from '@shared/ui/logos/yandex-logo'
import { handleFormErrors } from '@shared/utils/misc'
import { PocketidLogo } from '@shared/ui/logos'
import { queryClient } from '@shared/api'

interface IProps {
    oauth2Settings: NonNullable<GetRemnawaveSettingsCommand.Response['response']['oauth2Settings']>
    passkeySettings: NonNullable<
        GetRemnawaveSettingsCommand.Response['response']['passkeySettings']
    >
    passwordSettings: NonNullable<
        GetRemnawaveSettingsCommand.Response['response']['passwordSettings']
    >
    tgAuthSettings: NonNullable<GetRemnawaveSettingsCommand.Response['response']['tgAuthSettings']>
}

const getOAuth2ProvidersConfig = () =>
    [
        {
            key: 'github' as const,
            title: 'GitHub',
            icon: <BiLogoGithub size={24} />,
            iconColor: '#1B1F24',
            fields: ['clientId', 'clientSecret', 'allowedEmails'] as const
        },
        {
            key: 'pocketid' as const,
            title: 'PocketID',
            icon: <PocketidLogo size={24} />,
            iconColor: '#000',
            fields: ['clientId', 'clientSecret', 'plainDomain', 'allowedEmails'] as const
        },
        {
            key: 'yandex' as const,
            title: 'Yandex',
            icon: <YandexLogo size={24} />,
            iconColor: '#FC3F1D',
            fields: ['clientId', 'clientSecret', 'allowedEmails'] as const
        }
    ] as const

const getFieldConfig = (t: TFunction) =>
    ({
        clientId: {
            label: t('auth-settings.fields.clientId.label'),
            description: t('auth-settings.fields.clientId.description'),
            placeholder: t('auth-settings.fields.clientId.placeholder'),
            type: 'text' as const
        },
        clientSecret: {
            label: t('auth-settings.fields.clientSecret.label'),
            description: t('auth-settings.fields.clientSecret.description'),
            placeholder: t('auth-settings.fields.clientSecret.placeholder'),
            type: 'text' as const
        },
        plainDomain: {
            label: t('auth-settings.fields.plainDomain.label'),
            description: t('auth-settings.fields.plainDomain.description'),
            placeholder: t('auth-settings.fields.plainDomain.placeholder'),
            type: 'text' as const
        },
        allowedEmails: {
            label: t('auth-settings.fields.allowedEmails.label'),
            description: t('auth-settings.fields.allowedEmails.description'),
            placeholder: t('auth-settings.fields.allowedEmails.placeholder'),
            type: 'tags' as const
        }
    }) as const

export const AuthentificationSettingsCardWidget = (props: IProps) => {
    const { passkeySettings, passwordSettings, oauth2Settings, tgAuthSettings } = props
    const { t } = useTranslation()
    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)

    const form = useForm<NonNullable<UpdateRemnawaveSettingsCommand.Request>>({
        name: 'auth-settings',
        mode: 'uncontrolled',
        validate: zodResolver(
            UpdateRemnawaveSettingsCommand.RequestSchema.pick({
                passkeySettings: true,
                passwordSettings: true,
                oauth2Settings: true,
                tgAuthSettings: true
            })
        ),
        initialValues: {
            passkeySettings: {
                enabled: passkeySettings.enabled,
                rpId: passkeySettings.rpId,
                origin: passkeySettings.origin
            },
            passwordSettings: {
                enabled: passwordSettings.enabled
            },
            oauth2Settings: {
                github: oauth2Settings.github,
                pocketid: oauth2Settings.pocketid,
                yandex: oauth2Settings.yandex
            },
            tgAuthSettings: {
                enabled: tgAuthSettings.enabled,
                botToken: tgAuthSettings.botToken,
                adminIds: tgAuthSettings.adminIds
            }
        }
    })

    const { mutate: updateSettings, isPending: isUpdatePending } = useUpdateRemnawaveSettings({
        mutationFns: {
            onSuccess(data) {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.remnawaveSettings.getRemnawaveSettings.queryKey
                })

                form.setValues({
                    passkeySettings: data.passkeySettings!,
                    passwordSettings: data.passwordSettings!,
                    oauth2Settings: data.oauth2Settings!,
                    tgAuthSettings: data.tgAuthSettings!
                })

                form.resetDirty()
                form.resetTouched()
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
                passkeySettings: values.passkeySettings,
                passwordSettings: values.passwordSettings,
                oauth2Settings: values.oauth2Settings,
                tgAuthSettings: values.tgAuthSettings
            }
        })
    })

    const OAUTH2_PROVIDERS = getOAuth2ProvidersConfig()
    const FIELD_CONFIG = getFieldConfig(t)

    const renderOAuth2Provider = (config: ReturnType<typeof getOAuth2ProvidersConfig>[number]) => {
        return (
            <Accordion.Item key={config.key} value={config.key}>
                <Center>
                    <Accordion.Control
                        icon={
                            <ThemeIcon color={config.iconColor} size="lg" variant="filled">
                                {config.icon}
                            </ThemeIcon>
                        }
                    >
                        <Group justify="space-between" pr="md">
                            <Text fw={500}>{config.title}</Text>
                        </Group>
                    </Accordion.Control>
                    <Box pr="xs">
                        <Switch
                            color="teal.8"
                            key={form.key(`oauth2Settings.${config.key}.enabled`)}
                            onClick={(e) => e.stopPropagation()}
                            size="md"
                            {...form.getInputProps(`oauth2Settings.${config.key}.enabled`, {
                                type: 'checkbox'
                            })}
                        />
                    </Box>
                </Center>

                <Accordion.Panel>
                    <Stack gap="md">
                        {config.fields.map((fieldKey: keyof ReturnType<typeof getFieldConfig>) => {
                            const fieldConfig = FIELD_CONFIG[fieldKey]
                            const formPath = `oauth2Settings.${config.key}.${fieldKey}` as const

                            if (fieldConfig.type === 'tags') {
                                return (
                                    <TagsInput
                                        clearable
                                        description={fieldConfig.description}
                                        key={form.key(formPath)}
                                        label={fieldConfig.label}
                                        placeholder={fieldConfig.placeholder}
                                        splitChars={[',', ' ', ';']}
                                        {...form.getInputProps(formPath)}
                                    />
                                )
                            }

                            return (
                                <TextInput
                                    description={fieldConfig.description}
                                    key={form.key(formPath)}
                                    label={fieldConfig.label}
                                    placeholder={fieldConfig.placeholder}
                                    {...form.getInputProps(formPath)}
                                />
                            )
                        })}
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                <SettingsCardShared.Container>
                    <SettingsCardShared.Header
                        description={t('auth-settings.header.description')}
                        icon={<PiKey size={24} />}
                        title={t('auth-settings.header.title')}
                    />

                    <SettingsCardShared.Content>
                        <Accordion multiple variant="separated">
                            {/* Password */}
                            <Accordion.Item key="password" value="password">
                                <Center>
                                    <Accordion.Control
                                        disabled
                                        icon={
                                            <ThemeIcon color="orange" size="lg" variant="light">
                                                <TbPassword size={24} />
                                            </ThemeIcon>
                                        }
                                        style={{ opacity: 1.0 }}
                                        styles={{
                                            chevron: {
                                                display: 'none'
                                            }
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Text fw={500}>
                                                {t('auth-settings.password.title')}
                                            </Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Group justify="flex-end" pr="xs" wrap="nowrap">
                                        <Switch
                                            color="teal.8"
                                            key={form.key('passwordSettings.enabled')}
                                            onClick={(e) => e.stopPropagation()}
                                            size="md"
                                            {...form.getInputProps('passwordSettings.enabled', {
                                                type: 'checkbox'
                                            })}
                                        />
                                    </Group>
                                </Center>
                            </Accordion.Item>

                            {/* Passkey */}
                            <Accordion.Item key="passkey" value="passkey">
                                <Center>
                                    <Accordion.Control
                                        icon={
                                            <ThemeIcon color="cyan" size="lg" variant="light">
                                                <TbFingerprint size={24} />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Group justify="space-between" pr="md">
                                            <Text fw={500}>{t('auth-settings.passkey.title')}</Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Group justify="flex-end" pr="xs" wrap="nowrap">
                                        <Switch
                                            color="teal.8"
                                            key={form.key('passkeySettings.enabled')}
                                            onClick={(e) => e.stopPropagation()}
                                            size="md"
                                            {...form.getInputProps('passkeySettings.enabled', {
                                                type: 'checkbox'
                                            })}
                                        />
                                    </Group>
                                </Center>

                                <Accordion.Panel>
                                    <Group justify="right">
                                        <Button
                                            color="gray"
                                            disabled={!form.getValues().passkeySettings!.enabled}
                                            leftSection={<TbFingerprint size={20} />}
                                            onClick={openDrawer}
                                            size="md"
                                            variant="light"
                                        >
                                            {t('auth-settings.passkey.manage-button')}
                                        </Button>
                                    </Group>

                                    <Stack gap="md">
                                        <TextInput
                                            description={t(
                                                'auth-settings.passkey.rpId.description'
                                            )}
                                            key={form.key('passkeySettings.rpId')}
                                            label={t('auth-settings.passkey.rpId.label')}
                                            leftSection={<PiGlobe size={16} />}
                                            placeholder="example.com"
                                            {...form.getInputProps('passkeySettings.rpId')}
                                        />

                                        <TextInput
                                            description={t(
                                                'auth-settings.passkey.origin.description'
                                            )}
                                            key={form.key('passkeySettings.origin')}
                                            label={t('auth-settings.passkey.origin.label')}
                                            leftSection={<TbServer size={16} />}
                                            placeholder="https://api.example.com"
                                            {...form.getInputProps('passkeySettings.origin')}
                                        />
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>

                            {/* OAuth2 */}
                            {OAUTH2_PROVIDERS.map(renderOAuth2Provider)}

                            {/* Telegram */}
                            <Accordion.Item key="tgAuth" value="tgAuth">
                                <Center>
                                    <Accordion.Control
                                        icon={
                                            <ThemeIcon color="#0088cc" size="lg" variant="filled">
                                                <BiLogoTelegram color="white" size={20} />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Group justify="space-between" pr="md">
                                            <Text fw={500}>Telegram</Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Group justify="flex-end" pr="xs" wrap="nowrap">
                                        <Switch
                                            color="teal.8"
                                            key={form.key('tgAuthSettings.enabled')}
                                            onClick={(e) => e.stopPropagation()}
                                            size="md"
                                            {...form.getInputProps('tgAuthSettings.enabled', {
                                                type: 'checkbox'
                                            })}
                                        />
                                    </Group>
                                </Center>

                                <Accordion.Panel>
                                    <Stack gap="md">
                                        <TextInput
                                            description={t(
                                                'auth-settings.telegram.botToken.description'
                                            )}
                                            key={form.key('tgAuthSettings.botToken')}
                                            label={t('auth-settings.telegram.botToken.label')}
                                            placeholder={t(
                                                'auth-settings.telegram.botToken.placeholder'
                                            )}
                                            {...form.getInputProps('tgAuthSettings.botToken')}
                                        />

                                        <TagsInput
                                            clearable
                                            description={t(
                                                'auth-settings.telegram.adminIds.description'
                                            )}
                                            key={form.key('tgAuthSettings.adminIds')}
                                            label={t('auth-settings.telegram.adminIds.label')}
                                            placeholder={t(
                                                'auth-settings.telegram.adminIds.placeholder'
                                            )}
                                            splitChars={[',', ' ', ';']}
                                            {...form.getInputProps('tgAuthSettings.adminIds')}
                                        />
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
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
            <PasskeysDrawerComponent onClose={closeDrawer} opened={drawerOpened} />
        </>
    )
}
