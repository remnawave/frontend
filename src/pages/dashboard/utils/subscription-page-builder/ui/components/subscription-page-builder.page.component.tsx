import {
    Alert,
    Button,
    Code,
    Container,
    Flex,
    Grid,
    LoadingOverlay,
    Modal,
    Paper,
    ScrollArea,
    Stack,
    Tabs,
    Text
} from '@mantine/core'
import { TbAlertCircle as IconAlertCircle, TbPlus as IconPlus } from 'react-icons/tb'
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

    const updateApp = (updatedApp: AppConfig & { _oldId?: string }) => {
        const updatedConfig = { ...config }

        if (updatedApp._oldId && updatedApp._oldId !== updatedApp.id) {
            const appIndex = updatedConfig[activeTab].findIndex(
                (app) => app.id === updatedApp._oldId
            )
            if (appIndex !== -1) {
                const appWithoutOldId = { ...updatedApp } as AppConfig
                delete (appWithoutOldId as AppConfig & { _oldId?: string })._oldId
                updatedConfig[activeTab][appIndex] = appWithoutOldId

                if (selectedAppId === updatedApp._oldId) {
                    setSelectedAppId(updatedApp.id)
                }

                setConfig(updatedConfig)
            }
        } else {
            const appIndex = updatedConfig[activeTab].findIndex((app) => app.id === updatedApp.id)
            if (appIndex !== -1) {
                const appWithoutOldId = { ...updatedApp } as AppConfig
                if ((updatedApp as AppConfig & { _oldId?: string })._oldId) {
                    delete (appWithoutOldId as AppConfig & { _oldId?: string })._oldId
                }
                updatedConfig[activeTab][appIndex] = appWithoutOldId
                setConfig(updatedConfig)
            }
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

    const validateAndApplyConfig = (configData: PlatformConfig) => {
        const validationResult = validatePlatformConfig(configData)

        if (!validationResult.valid) {
            setValidationErrors(validationResult.errors)
            open()
            return false
        }

        setConfig(configData as PlatformConfig)

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
                const configData = JSON.parse(e.target?.result as string)
                const isValid = validateAndApplyConfig(configData)

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
            const isValid = validateAndApplyConfig(configData)

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

    return (
        <Page title={t('constants.subscription-page-builder')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.utils') },
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
                                    config[activeTab].map((app) => (
                                        <Paper
                                            key={app.id}
                                            onClick={() => setSelectedAppId(app.id)}
                                            p="sm"
                                            radius="md"
                                            shadow={selectedAppId === app.id ? 'md' : 'xs'}
                                            style={{
                                                cursor: 'pointer',
                                                borderColor:
                                                    selectedAppId === app.id
                                                        ? 'var(--mantine-color-cyan-outline)'
                                                        : undefined
                                            }}
                                            withBorder
                                        >
                                            <Text fw={500}>{app.name}</Text>
                                            <Text c="dimmed" size="xs">
                                                {app.urlScheme ? app.urlScheme : 'No URL scheme'}
                                            </Text>
                                        </Paper>
                                    ))
                                )}

                                <Button
                                    fullWidth
                                    leftSection={<IconPlus size="1rem" />}
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
                        icon={<IconAlertCircle size="1rem" />}
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
