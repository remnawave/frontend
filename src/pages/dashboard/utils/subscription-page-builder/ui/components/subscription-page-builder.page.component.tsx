/* eslint-disable @stylistic/indent */

import {
    Accordion,
    ActionIcon,
    Alert,
    Box,
    Button,
    Code,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    ScrollArea,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import {
    TbAlertCircle as IconAlertCircle,
    TbPlus as IconPlus,
    TbChevronDown,
    TbChevronUp,
    TbDevices,
    TbSettings,
    TbStar
} from 'react-icons/tb'
import { PiAndroidLogo, PiAppleLogo, PiLinuxLogo, PiWindowsLogo } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { consola } from 'consola/browser'
import { useState } from 'react'

import { SubscriptionPageBuilderHeaderWidget } from '@widgets/dashboard/utils/subscription-page-builder-header'
import { Page } from '@shared/ui'

import {
    IAppConfig,
    ISubscriptionPageAppConfig,
    TAdditionalLocales,
    TPlatform
} from '../../model/types'
import { cleanupSubscriptionPageConfig } from '../../model/locale-cleanup.utils'
import { validateSubscriptionPageAppConfig } from '../../model/validators'
import { createEmptyApp, emptyConfig } from '../../model/config'
import { autoMigrateConfig } from '../../model/migration.utils'
import { LanguageSelector } from './language-selector'
import { BrandingSettings } from './branding-settings'
import classes from './CustomTabs.module.css'
import { AppForm } from './app-form'

const DEFAULT_CONFIG_URL =
    'https://raw.githubusercontent.com/remnawave/subscription-page/refs/heads/main/frontend/public/assets/app-config.json'

export const SubscriptionPageBuilderComponent = () => {
    const { t } = useTranslation()
    const [config, setConfig] = useState<ISubscriptionPageAppConfig>(emptyConfig)
    const [activeTab, setActiveTab] = useState<TPlatform>('ios')
    const [selectedAppId, setSelectedAppId] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [opened, { open, close }] = useDisclosure(false)

    const addNewApp = () => {
        const newApp = createEmptyApp(activeTab, config.config.additionalLocales)
        const updatedConfig = { ...config }
        updatedConfig.platforms[activeTab] = [...updatedConfig.platforms[activeTab], newApp]

        setConfig(updatedConfig)

        setTimeout(() => {
            setSelectedAppId(newApp.id)
        }, 10)
    }

    const updateApp = (updatedApp: IAppConfig) => {
        const updatedConfig = { ...config }
        const appIndex = updatedConfig.platforms[activeTab].findIndex(
            (app: IAppConfig) => app.id === updatedApp.id
        )

        if (appIndex !== -1) {
            updatedConfig.platforms[activeTab][appIndex] = updatedApp
            setConfig(updatedConfig)
        }
    }

    const deleteApp = (appId: string) => {
        const updatedConfig = { ...config }
        updatedConfig.platforms[activeTab] = updatedConfig.platforms[activeTab].filter(
            (app: IAppConfig) => app.id !== appId
        )
        setConfig(updatedConfig)

        if (updatedConfig.platforms[activeTab].length > 0) {
            setSelectedAppId(updatedConfig.platforms[activeTab][0].id)
        } else {
            setSelectedAppId(null)
        }
    }

    const updateAdditionalLocales = (locales: TAdditionalLocales[]) => {
        let updatedConfig = { ...config }
        updatedConfig.config.additionalLocales = locales

        updatedConfig = cleanupSubscriptionPageConfig(updatedConfig)

        setConfig(updatedConfig)
    }

    const updateBranding = (branding: { logoUrl?: string; name?: string; supportUrl?: string }) => {
        const updatedConfig = { ...config }

        const cleanBranding = Object.entries(branding).reduce(
            (acc, [key, value]) => {
                if (value !== undefined && value !== '') {
                    acc[key as keyof typeof branding] = value
                }
                return acc
            },
            {} as typeof branding
        )

        if (Object.keys(cleanBranding).length > 0) {
            updatedConfig.config.branding = cleanBranding
        } else {
            delete updatedConfig.config.branding
        }

        setConfig(updatedConfig)
    }

    const moveAppUp = (appId: string) => {
        const updatedConfig = { ...config }
        const apps = [...updatedConfig.platforms[activeTab]]
        const currentIndex = apps.findIndex((app: IAppConfig) => app.id === appId)

        if (currentIndex > 0) {
            const temp = apps[currentIndex]
            apps[currentIndex] = apps[currentIndex - 1]
            apps[currentIndex - 1] = temp
            updatedConfig.platforms[activeTab] = apps
            setConfig(updatedConfig)
        }
    }

    const moveAppDown = (appId: string) => {
        const updatedConfig = { ...config }
        const apps = [...updatedConfig.platforms[activeTab]]
        const currentIndex = apps.findIndex((app: IAppConfig) => app.id === appId)

        if (currentIndex < apps.length - 1) {
            const temp = apps[currentIndex]
            apps[currentIndex] = apps[currentIndex + 1]
            apps[currentIndex + 1] = temp
            updatedConfig.platforms[activeTab] = apps
            setConfig(updatedConfig)
        }
    }

    const normalizeConfigIds = (config: ISubscriptionPageAppConfig): ISubscriptionPageAppConfig => {
        const normalizedConfig = JSON.parse(JSON.stringify(config)) as ISubscriptionPageAppConfig

        if (normalizedConfig.platforms) {
            Object.keys(normalizedConfig.platforms).forEach((platform) => {
                if (normalizedConfig.platforms[platform as TPlatform]) {
                    normalizedConfig.platforms[platform as TPlatform] = normalizedConfig.platforms[
                        platform as TPlatform
                    ].map((app: IAppConfig) => ({
                        ...app,
                        id: app.id.toLowerCase()
                    }))
                }
            })
        }

        return normalizedConfig
    }

    const validateAndApplyConfig = (configData: unknown) => {
        const migratedConfig = autoMigrateConfig(configData)

        const validationResult = validateSubscriptionPageAppConfig(migratedConfig)

        if (!validationResult.valid) {
            setValidationErrors(validationResult.errors)
            open()
            return false
        }

        setConfig(migratedConfig)

        const platformsWithApps = Object.keys(migratedConfig.platforms).find(
            (platform) => migratedConfig.platforms[platform as TPlatform].length > 0
        ) as TPlatform | undefined

        if (platformsWithApps) {
            setActiveTab(platformsWithApps)
            setSelectedAppId(migratedConfig.platforms[platformsWithApps][0].id)
        }

        return true
    }

    const exportConfig = () => {
        const isValid = validateAndApplyConfig(config)
        if (!isValid) {
            return
        }

        const dataStr = JSON.stringify(config, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportFileDefaultName = 'app-config.json'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const importConfig = (file: File | null) => {
        if (!file) {
            return
        }

        setLoading(true)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const configData = JSON.parse(e.target?.result as string)

                const migratedConfig = autoMigrateConfig(configData)
                const normalizedConfig = normalizeConfigIds(migratedConfig)
                const isValid = validateAndApplyConfig(normalizedConfig)

                if (!isValid) {
                    consola.error('Validation failed for imported config')
                }
            } catch (error) {
                consola.error('Failed to parse config file', error)
                setValidationErrors([
                    t('subscription-page-builder.page.component.failed-to-parse-config')
                ])
                open()
            } finally {
                setLoading(false)
            }
        }

        reader.readAsText(file)
    }

    const loadDefaultConfig = async () => {
        setLoading(true)

        try {
            const response = await fetch(DEFAULT_CONFIG_URL)

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`)
            }

            const configData = await response.json()

            const migratedConfig = autoMigrateConfig(configData)
            const normalizedConfig = normalizeConfigIds(migratedConfig)
            const isValid = validateAndApplyConfig(normalizedConfig)

            if (!isValid) {
                consola.error('Validation failed for default config')
            }
        } catch (error) {
            consola.error('Failed to load default config', error)
            setValidationErrors([
                t(
                    'subscription-page-builder.page.component.failed-to-load-default-config-check-your-internet-connection'
                )
            ])
            open()
        } finally {
            setLoading(false)
        }
    }

    const selectedApp = config.platforms[activeTab].find(
        (app: IAppConfig) => app.id === selectedAppId
    )

    const getPlatformIcon = (platform: TPlatform) => {
        switch (platform) {
            case 'android':
                return <PiAndroidLogo size="18px" />
            case 'androidTV':
                return <PiAndroidLogo size="18px" />
            case 'appleTV':
                return <PiAppleLogo size="18px" />
            case 'ios':
                return <PiAppleLogo size="18px" />
            case 'linux':
                return <PiLinuxLogo size="18px" />
            case 'macos':
                return <PiAppleLogo size="18px" />
            case 'windows':
                return <PiWindowsLogo size="18px" />
            default:
                return <PiAppleLogo size="18px" />
        }
    }

    const getPlatformColor = (platform: TPlatform) => {
        switch (platform) {
            case 'android':
                return 'teal'
            case 'androidTV':
                return 'teal'
            case 'appleTV':
                return 'gray'
            case 'ios':
                return 'gray'
            case 'linux':
                return 'gray'
            case 'macos':
                return 'gray'
            case 'windows':
                return 'blue'
            default:
                return 'gray'
        }
    }

    return (
        <Page title={t('constants.subscription-page-builder')}>
            <Container fluid p={0} pos="relative" size="xl">
                <LoadingOverlay visible={loading} />

                <SubscriptionPageBuilderHeaderWidget
                    exportConfig={exportConfig}
                    importConfig={importConfig}
                    loadDefaultConfig={loadDefaultConfig}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="md">
                            <Accordion
                                chevronPosition="left"
                                defaultValue="platform"
                                variant="separated"
                            >
                                <Accordion.Item value="config">
                                    <Accordion.Control>
                                        <Group gap="xs">
                                            <TbSettings size={16} />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'subscription-page-builder.page.component.configuration-settings'
                                                )}
                                            </Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Stack gap="md">
                                            <BrandingSettings
                                                branding={config.config.branding}
                                                onChange={updateBranding}
                                            />

                                            <Divider my="xs" />

                                            <LanguageSelector
                                                additionalLocales={config.config.additionalLocales}
                                                onChange={updateAdditionalLocales}
                                            />
                                        </Stack>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="platform">
                                    <Accordion.Control>
                                        <Group gap="xs">
                                            <TbDevices size={16} />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'subscription-page-builder.page.component.platform-apps'
                                                )}
                                            </Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Box>
                                            <Tabs
                                                classNames={classes}
                                                onChange={(value) =>
                                                    setActiveTab(value as TPlatform)
                                                }
                                                value={activeTab}
                                                variant="unstyled"
                                            >
                                                <Tabs.List grow>
                                                    <Tabs.Tab
                                                        leftSection={<PiAppleLogo />}
                                                        value="ios"
                                                    >
                                                        iOS
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiAndroidLogo />}
                                                        value="android"
                                                    >
                                                        Android
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiWindowsLogo />}
                                                        value="windows"
                                                    >
                                                        Windows
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiAppleLogo />}
                                                        value="macos"
                                                    >
                                                        macOS
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiLinuxLogo />}
                                                        value="linux"
                                                    >
                                                        Linux
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiAndroidLogo />}
                                                        value="androidTV"
                                                    >
                                                        AndroidTV
                                                    </Tabs.Tab>
                                                    <Tabs.Tab
                                                        leftSection={<PiAppleLogo />}
                                                        value="appleTV"
                                                    >
                                                        AppleTV
                                                    </Tabs.Tab>
                                                </Tabs.List>
                                            </Tabs>

                                            <Stack mt="md">
                                                {config.platforms[activeTab].length === 0 ? (
                                                    <Text c="dimmed" py="xl" ta="center">
                                                        {t(
                                                            'subscription-page-builder.page.component.no-apps-configured-for-this-platform'
                                                        )}
                                                    </Text>
                                                ) : (
                                                    config.platforms[activeTab].map(
                                                        (app: IAppConfig, index: number) => (
                                                            <Paper
                                                                key={app.id}
                                                                p="md"
                                                                shadow={
                                                                    selectedAppId === app.id
                                                                        ? 'lg'
                                                                        : 'xs'
                                                                }
                                                                style={{
                                                                    borderColor:
                                                                        selectedAppId === app.id
                                                                            ? `var(--mantine-color-${getPlatformColor(activeTab)}-outline)`
                                                                            : undefined,
                                                                    borderWidth:
                                                                        selectedAppId === app.id
                                                                            ? 2
                                                                            : 1,
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                withBorder
                                                            >
                                                                <Group
                                                                    align="flex-start"
                                                                    justify="space-between"
                                                                >
                                                                    <div
                                                                        onClick={() =>
                                                                            setSelectedAppId(app.id)
                                                                        }
                                                                        style={{
                                                                            flex: 1
                                                                        }}
                                                                    >
                                                                        <Group gap="xs" mb="xs">
                                                                            <ThemeIcon
                                                                                color={getPlatformColor(
                                                                                    activeTab
                                                                                )}
                                                                                size="sm"
                                                                                variant="light"
                                                                            >
                                                                                {getPlatformIcon(
                                                                                    activeTab
                                                                                )}
                                                                            </ThemeIcon>
                                                                            <Text
                                                                                fw={600}
                                                                                size="sm"
                                                                            >
                                                                                {app.name}
                                                                            </Text>
                                                                            {app.isFeatured && (
                                                                                <TbStar
                                                                                    color="gold"
                                                                                    size={16}
                                                                                />
                                                                            )}
                                                                        </Group>

                                                                        <Text c="dimmed" size="xs">
                                                                            {app.urlScheme ||
                                                                                'No URL scheme'}
                                                                        </Text>
                                                                    </div>
                                                                    <Group gap={4}>
                                                                        <Tooltip
                                                                            label={t(
                                                                                'subscription-page-builder.page.component.move-up'
                                                                            )}
                                                                        >
                                                                            <ActionIcon
                                                                                disabled={
                                                                                    index === 0
                                                                                }
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    moveAppUp(
                                                                                        app.id
                                                                                    )
                                                                                }}
                                                                                size="sm"
                                                                                variant="subtle"
                                                                            >
                                                                                <TbChevronUp />
                                                                            </ActionIcon>
                                                                        </Tooltip>
                                                                        <Tooltip
                                                                            label={t(
                                                                                'subscription-page-builder.page.component.move-down'
                                                                            )}
                                                                        >
                                                                            <ActionIcon
                                                                                disabled={
                                                                                    index ===
                                                                                    config
                                                                                        .platforms[
                                                                                        activeTab
                                                                                    ].length -
                                                                                        1
                                                                                }
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    moveAppDown(
                                                                                        app.id
                                                                                    )
                                                                                }}
                                                                                size="sm"
                                                                                variant="subtle"
                                                                            >
                                                                                <TbChevronDown />
                                                                            </ActionIcon>
                                                                        </Tooltip>
                                                                    </Group>
                                                                </Group>
                                                            </Paper>
                                                        )
                                                    )
                                                )}

                                                <Button
                                                    fullWidth
                                                    leftSection={<IconPlus size="16px" />}
                                                    mt="md"
                                                    onClick={addNewApp}
                                                    variant="default"
                                                >
                                                    {t(
                                                        'subscription-page-builder.page.component.add-app'
                                                    )}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Paper p="md" shadow="sm" withBorder>
                            {selectedApp ? (
                                <AppForm
                                    additionalLocales={config.config.additionalLocales}
                                    app={selectedApp}
                                    onChange={updateApp}
                                    onDelete={() => deleteApp(selectedApp.id)}
                                />
                            ) : (
                                <Flex align="center" h={400} justify="center">
                                    <Text c="dimmed" ta="center">
                                        {t(
                                            'subscription-page-builder.page.component.select-an-app-from-the-sidebar-or-add-a-new-one'
                                        )}
                                    </Text>
                                </Flex>
                            )}
                        </Paper>
                    </Grid.Col>
                </Grid>

                <Modal
                    centered
                    onClose={close}
                    opened={opened}
                    size="lg"
                    title={t('subscription-page-builder.page.component.validation-errors')}
                >
                    <Alert
                        color="red"
                        icon={<IconAlertCircle size="16px" />}
                        mb="md"
                        title={t('subscription-page-builder.page.component.invalid-configuration')}
                    >
                        {t(
                            'subscription-page-builder.page.component.the-configuration-did-not-pass-validation'
                        )}
                    </Alert>
                    <ScrollArea h={300} offsetScrollbars="present">
                        <Stack gap="xs">
                            <Code block>
                                {validationErrors.map((error, index) => (
                                    <Text key={index} size="sm">
                                        {error}
                                    </Text>
                                ))}
                            </Code>
                        </Stack>
                    </ScrollArea>
                    <Flex justify="flex-end" mt="lg">
                        <Button onClick={close} variant="outline">
                            {t('common.close')}
                        </Button>
                    </Flex>
                </Modal>
            </Container>
        </Page>
    )
}
