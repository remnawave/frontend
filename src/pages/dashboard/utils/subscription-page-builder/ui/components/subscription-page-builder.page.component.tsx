import {
    ActionIcon,
    Alert,
    Button,
    Code,
    Container,
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
    TbStar
} from 'react-icons/tb'
import { PiAndroidLogo, PiAppleLogo, PiWindowsLogo } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { consola } from 'consola/browser'
import { useState } from 'react'

import { SubscriptionPageBuilderHeaderWidget } from '@widgets/dashboard/utils/subscription-page-builder-header'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { createEmptyApp, emptyConfig } from '../../model/config'
import { validatePlatformConfig } from '../../model/validators'
import { AppConfig, PlatformConfig } from '../../model/types'
import { AppForm } from './app-form'

const DEFAULT_CONFIG_URL =
    'https://raw.githubusercontent.com/remnawave/subscription-page/refs/heads/main/frontend/public/assets/app-config.json'

export const SubscriptionPageBuilderComponent = () => {
    const { t } = useTranslation()
    const [config, setConfig] = useState<PlatformConfig>(emptyConfig)
    const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>('ios')
    const [selectedAppId, setSelectedAppId] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [opened, { open, close }] = useDisclosure(false)

    const addNewApp = () => {
        const newApp = createEmptyApp(activeTab)
        const updatedConfig = { ...config }
        updatedConfig[activeTab] = [...updatedConfig[activeTab], newApp]

        setConfig(updatedConfig)

        setTimeout(() => {
            setSelectedAppId(newApp.id)
        }, 10)
    }

    const updateApp = (updatedApp: AppConfig) => {
        const updatedConfig = { ...config }
        const appIndex = updatedConfig[activeTab].findIndex((app) => app.id === updatedApp.id)

        if (appIndex !== -1) {
            updatedConfig[activeTab][appIndex] = updatedApp
            setConfig(updatedConfig)
        }
    }

    const deleteApp = (appId: string) => {
        const updatedConfig = { ...config }
        updatedConfig[activeTab] = updatedConfig[activeTab].filter((app) => app.id !== appId)
        setConfig(updatedConfig)

        if (updatedConfig[activeTab].length > 0) {
            setSelectedAppId(updatedConfig[activeTab][0].id)
        } else {
            setSelectedAppId(null)
        }
    }

    const moveAppUp = (appId: string) => {
        const updatedConfig = { ...config }
        const apps = [...updatedConfig[activeTab]]
        const currentIndex = apps.findIndex((app) => app.id === appId)

        if (currentIndex > 0) {
            const temp = apps[currentIndex]
            apps[currentIndex] = apps[currentIndex - 1]
            apps[currentIndex - 1] = temp
            updatedConfig[activeTab] = apps
            setConfig(updatedConfig)
        }
    }

    const moveAppDown = (appId: string) => {
        const updatedConfig = { ...config }
        const apps = [...updatedConfig[activeTab]]
        const currentIndex = apps.findIndex((app) => app.id === appId)

        if (currentIndex < apps.length - 1) {
            const temp = apps[currentIndex]
            apps[currentIndex] = apps[currentIndex + 1]
            apps[currentIndex + 1] = temp
            updatedConfig[activeTab] = apps
            setConfig(updatedConfig)
        }
    }

    const normalizeConfigIds = (config: PlatformConfig): PlatformConfig => {
        const normalizedConfig = JSON.parse(JSON.stringify(config)) as PlatformConfig

        normalizedConfig.ios = normalizedConfig.ios.map((app) => ({
            ...app,
            id: app.id.toLowerCase() as `${Lowercase<string>}`
        }))

        normalizedConfig.android = normalizedConfig.android.map((app) => ({
            ...app,
            id: app.id.toLowerCase() as `${Lowercase<string>}`
        }))

        normalizedConfig.pc = normalizedConfig.pc.map((app) => ({
            ...app,
            id: app.id.toLowerCase() as `${Lowercase<string>}`
        }))

        return normalizedConfig
    }

    const validateAndApplyConfig = (configData: PlatformConfig) => {
        const validationResult = validatePlatformConfig(configData)

        if (!validationResult.valid) {
            setValidationErrors(validationResult.errors)
            open()
            return false
        }

        setConfig(configData)

        if (configData.ios?.length > 0) {
            setActiveTab('ios')
            setSelectedAppId(configData.ios[0].id)
        } else if (configData.android?.length > 0) {
            setActiveTab('android')
            setSelectedAppId(configData.android[0].id)
        } else if (configData.pc?.length > 0) {
            setActiveTab('pc')
            setSelectedAppId(configData.pc[0].id)
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
                const configData = JSON.parse(e.target?.result as string) as PlatformConfig
                const normalizedConfig = normalizeConfigIds(configData)
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

            const configData = (await response.json()) as PlatformConfig
            const normalizedConfig = normalizeConfigIds(configData)
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

    const selectedApp = config[activeTab].find((app) => app.id === selectedAppId)

    const getPlatformIcon = (platform: 'android' | 'ios' | 'pc') => {
        switch (platform) {
            case 'android':
                return <PiAndroidLogo size="18px" />
            case 'ios':
                return <PiAppleLogo size="18px" />
            case 'pc':
                return <PiWindowsLogo size="18px" />
            default:
                return <PiAppleLogo size="18px" />
        }
    }

    const getPlatformColor = (platform: 'android' | 'ios' | 'pc') => {
        switch (platform) {
            case 'android':
                return 'teal'
            case 'ios':
                return 'gray'
            case 'pc':
                return 'blue'
            default:
                return 'gray'
        }
    }

    return (
        <Page title={t('constants.subscription-page-builder')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.subscription-page-builder') }
                ]}
                title={t('constants.subscription-page-builder')}
            />
            <Container fluid p={0} pos="relative" size="xl">
                <LoadingOverlay visible={loading} />

                <SubscriptionPageBuilderHeaderWidget
                    exportConfig={exportConfig}
                    importConfig={importConfig}
                    loadDefaultConfig={loadDefaultConfig}
                />

                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Paper p="md" radius="md" shadow="sm" withBorder>
                            <Tabs
                                onChange={(value) =>
                                    setActiveTab(value as 'android' | 'ios' | 'pc')
                                }
                                value={activeTab}
                            >
                                <Tabs.List grow>
                                    <Tabs.Tab leftSection={<PiAppleLogo />} value="ios">
                                        iOS
                                    </Tabs.Tab>
                                    <Tabs.Tab leftSection={<PiAndroidLogo />} value="android">
                                        Android
                                    </Tabs.Tab>
                                    <Tabs.Tab leftSection={<PiWindowsLogo />} value="pc">
                                        PC
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs>

                            <Stack mt="md">
                                {config[activeTab].length === 0 ? (
                                    <Text c="dimmed" py="xl" ta="center">
                                        {t(
                                            'subscription-page-builder.page.component.no-apps-configured-for-this-platform'
                                        )}
                                    </Text>
                                ) : (
                                    config[activeTab].map((app, index) => (
                                        <Paper
                                            key={app.id}
                                            p="md"
                                            radius="md"
                                            shadow={selectedAppId === app.id ? 'lg' : 'xs'}
                                            style={{
                                                borderColor:
                                                    selectedAppId === app.id
                                                        ? `var(--mantine-color-${getPlatformColor(activeTab)}-outline)`
                                                        : undefined,
                                                borderWidth: selectedAppId === app.id ? 2 : 1,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            withBorder
                                        >
                                            <Group align="flex-start" justify="space-between">
                                                <div
                                                    onClick={() => setSelectedAppId(app.id)}
                                                    style={{
                                                        flex: 1
                                                    }}
                                                >
                                                    <Group gap="xs" mb="xs">
                                                        <ThemeIcon
                                                            color={getPlatformColor(activeTab)}
                                                            radius="md"
                                                            size="sm"
                                                            variant="light"
                                                        >
                                                            {getPlatformIcon(activeTab)}
                                                        </ThemeIcon>
                                                        <Text fw={600} size="sm">
                                                            {app.name}
                                                        </Text>
                                                        {app.isFeatured && (
                                                            <TbStar color="gold" size={16} />
                                                        )}
                                                    </Group>

                                                    <Text c="dimmed" size="xs">
                                                        {app.urlScheme || 'No URL scheme'}
                                                    </Text>
                                                </div>
                                                <Group gap={4}>
                                                    <Tooltip label="Move up">
                                                        <ActionIcon
                                                            disabled={index === 0}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                moveAppUp(app.id)
                                                            }}
                                                            size="sm"
                                                            variant="subtle"
                                                        >
                                                            <TbChevronUp />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Move down">
                                                        <ActionIcon
                                                            disabled={
                                                                index ===
                                                                config[activeTab].length - 1
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                moveAppDown(app.id)
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
                                    ))
                                )}

                                <Button
                                    fullWidth
                                    leftSection={<IconPlus size="16px" />}
                                    mt="md"
                                    onClick={addNewApp}
                                >
                                    {t('subscription-page-builder.page.component.add-app')}
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Paper p="md" radius="md" shadow="sm" withBorder>
                            {selectedApp ? (
                                <AppForm
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
                            {t('subscription-page-builder.page.component.close')}
                        </Button>
                    </Flex>
                </Modal>
            </Container>
        </Page>
    )
}
