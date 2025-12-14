import {
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageConfigAdditionalLocales,
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey,
    TSubscriptionPagePlatformSchema,
    TSubscriptionPageRawConfig,
    TSubscriptionPageUiConfig
} from '@remnawave/subscription-page-types'
import {
    Accordion,
    Badge,
    Box,
    Button,
    Card,
    Code,
    Divider,
    Group,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import {
    IconCloudDownload,
    IconDeviceDesktop,
    IconDeviceFloppy,
    IconDownload,
    IconGlobe,
    IconPalette,
    IconPhoto,
    IconPlus
} from '@tabler/icons-react'
import { GetSubscriptionPageConfigCommand } from '@remnawave/backend-contract'
import { TbAlertTriangle, TbCheck } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useState } from 'react'

import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { QueryKeys, useUpdateSubscriptionPageConfig } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { queryClient } from '@shared/api/query-client'

import { AVAILABLE_PLATFORMS, LOCALE_DATA, PLATFORM_LABELS } from './subpage-config.constants'
import { LocalizedTextEditor } from './editor-components/localized-text-editor.component'
import { SvgLibraryModal } from './editor-components/svg-library-modal.component'
import { PlatformEditor } from './editor-components/platform-editor.component'
import { LocaleCard } from './editor-components/locale-card.component'
import styles from './subpage-config-visual-editor.module.css'

interface Props {
    config: GetSubscriptionPageConfigCommand.Response['response']
}

export function SubpageConfigVisualEditorWidget(props: Props) {
    const { config: configResponse } = props

    const { t } = useTranslation()
    const [svgLibraryOpened, { close: closeSvgLibrary, open: openSvgLibrary }] =
        useDisclosure(false)

    const [configState, setConfigState] = useState<TSubscriptionPageRawConfig>(
        configResponse.config as unknown as TSubscriptionPageRawConfig
    )

    const enabledLocales: TSubscriptionPageLocales[] = ['en', ...configState.additionalLocales]
    const svgLibraryCount = Object.keys(configState.svgLibrary || {}).length

    const { mutate: updateSubscriptionPageConfig, isPending: isUpdatingSubscriptionPageConfig } =
        useUpdateSubscriptionPageConfig({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        QueryKeys.subpageConfigs.getSubscriptionPageConfig({
                            uuid: configResponse.uuid
                        }).queryKey,
                        data
                    )
                }
            }
        })

    const { openDownloadModal } = useDownloadTemplate({
        editorType: 'SUBPAGE_CONFIG',
        templateType: 'SUBPAGE_CONFIG',
        onLoadTemplate: async (content) => {
            setConfigState(JSON.parse(content))
        }
    })

    const handleAddPlatform = (platformKey: TSubscriptionPagePlatformKey) => {
        if (configState.platforms[platformKey]) return

        const newPlatform: TSubscriptionPagePlatformSchema = {
            apps: [],
            displayName: { en: PLATFORM_LABELS[platformKey] },
            svgIconKey: ''
        }

        setConfigState({
            ...configState,
            platforms: { ...configState.platforms, [platformKey]: newPlatform }
        })
    }

    const handlePlatformChange = (
        platformKey: TSubscriptionPagePlatformKey,
        updatedPlatform: TSubscriptionPagePlatformSchema
    ) => {
        setConfigState({
            ...configState,
            platforms: { ...configState.platforms, [platformKey]: updatedPlatform }
        })
    }

    const handlePlatformDelete = (platformKey: TSubscriptionPagePlatformKey) => {
        const newPlatforms = { ...configState.platforms }
        delete newPlatforms[platformKey]
        setConfigState({ ...configState, platforms: newPlatforms })
    }

    const existingPlatforms = Object.keys(configState.platforms) as TSubscriptionPagePlatformKey[]
    const availablePlatformsToAdd = AVAILABLE_PLATFORMS.filter(
        (p) => !existingPlatforms.includes(p.value)
    )

    const handleSave = () => {
        const validatedConfig = SubscriptionPageRawConfigSchema.safeParse(configState)
        if (!validatedConfig.success) {
            modals.open({
                title: (
                    <BaseOverlayHeader
                        IconComponent={TbAlertTriangle}
                        iconSize={20}
                        iconVariant="gradient-red"
                        title={t('subpage-config-visual-editor.widget.validation-error')}
                        titleOrder={5}
                    />
                ),
                children: (
                    <Stack gap="sm" p="sm">
                        <Stack gap={2} mt="xs">
                            {validatedConfig.error.errors?.length > 0 &&
                                validatedConfig.error.errors.map((err, idx) => (
                                    <Text c="red" key={idx} size="sm">
                                        • {err.path.length ? `${err.path.join('.')}: ` : ''}
                                        {err.message}
                                    </Text>
                                ))}
                        </Stack>
                    </Stack>
                ),
                centered: true,
                size: 'lg'
            })
            return
        }

        updateSubscriptionPageConfig({
            variables: { uuid: configResponse.uuid, config: configState }
        })

        modals.open({
            title: (
                <BaseOverlayHeader
                    IconComponent={TbCheck}
                    iconSize={20}
                    iconVariant="gradient-teal"
                    title={t(
                        'subpage-config-visual-editor.widget.configuration-saved-successfully'
                    )}
                    titleOrder={5}
                />
            ),
            children: (
                <Stack gap="xs">
                    <Stack gap={4}>
                        <Text fw={700}>
                            {t('subpage-config-visual-editor.subpage-config-saved-line-1')}
                        </Text>
                        <Text>{t('subpage-config-visual-editor.subpage-config-saved-line-2')}</Text>
                        <Code block mt={4}>
                            docker restart remnawave-subscription-page
                        </Code>
                    </Stack>
                </Stack>
            )
        })
    }

    const handleDownloadConfig = () => {
        const json = JSON.stringify(configState, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `subpage-${configResponse.uuid}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const toggleLocale = (code: TSubscriptionPageConfigAdditionalLocales) => {
        const has = configState.additionalLocales.includes(code)
        setConfigState({
            ...configState,
            additionalLocales: has
                ? configState.additionalLocales.filter((l) => l !== code)
                : [...configState.additionalLocales, code]
        })
    }

    const isLocaleActive = (code: TSubscriptionPageLocales, isDefault?: boolean) =>
        isDefault ||
        configState.additionalLocales.includes(code as TSubscriptionPageConfigAdditionalLocales)

    return (
        <Box className={styles.editorWrapper}>
            <div className={styles.content}>
                <div className={styles.headerWrapper}>
                    <Group justify="space-between">
                        <Group gap="sm">
                            <BaseOverlayHeader
                                IconComponent={IconPalette}
                                iconSize={20}
                                iconVariant="gradient-cyan"
                                subtitle={t(
                                    'subpage-config-visual-editor.widget.edit-your-subscription-page-configuration'
                                )}
                                title={t('subpage-config-visual-editor.widget.subpage-editor')}
                            />
                        </Group>
                        <Group>
                            <Button
                                className={styles.saveButton}
                                leftSection={<IconCloudDownload size={24} />}
                                onClick={openDownloadModal}
                                size="md"
                                variant="light"
                            >
                                {t('subpage-config-visual-editor.widget.load-from-github')}
                            </Button>

                            <Button
                                className={styles.saveButton}
                                leftSection={<IconDownload size={24} />}
                                onClick={handleDownloadConfig}
                                size="md"
                                variant="light"
                            >
                                {t('common.download')}
                            </Button>
                            <Button
                                className={styles.saveButton}
                                disabled={isUpdatingSubscriptionPageConfig}
                                leftSection={<IconDeviceFloppy size={24} />}
                                loading={isUpdatingSubscriptionPageConfig}
                                onClick={handleSave}
                                size="md"
                                variant="light"
                            >
                                {t('common.save')}
                            </Button>
                        </Group>
                    </Group>
                </div>

                <Stack gap="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <Card className={styles.sectionCard} p="lg" radius="lg">
                            <Stack gap="md" h="100%">
                                <BaseOverlayHeader
                                    IconComponent={IconPalette}
                                    iconSize={20}
                                    iconVariant="gradient-cyan"
                                    subtitle={t(
                                        'subpage-config-visual-editor.widget.brand-appearance'
                                    )}
                                    title={t('subpage-config-visual-editor.widget.branding')}
                                    titleOrder={5}
                                />

                                <Divider className={styles.divider} />

                                <TextInput
                                    classNames={{ input: styles.inputDark }}
                                    label={t('subpage-config-visual-editor.widget.brand-title')}
                                    onChange={(e) =>
                                        setConfigState({
                                            ...configState,
                                            brandingSettings: {
                                                ...configState.brandingSettings,
                                                title: e.target.value
                                            }
                                        })
                                    }
                                    placeholder={t(
                                        'subpage-config-visual-editor.widget.your-brand-name'
                                    )}
                                    value={configState.brandingSettings.title}
                                />

                                <TextInput
                                    classNames={{ input: styles.inputDark }}
                                    label={t('subpage-config-visual-editor.widget.logo-url')}
                                    onChange={(e) =>
                                        setConfigState({
                                            ...configState,
                                            brandingSettings: {
                                                ...configState.brandingSettings,
                                                logoUrl: e.target.value
                                            }
                                        })
                                    }
                                    placeholder="https://example.com/logo.png"
                                    value={configState.brandingSettings.logoUrl}
                                />

                                <TextInput
                                    classNames={{ input: styles.inputDark }}
                                    label={t('subpage-config-visual-editor.widget.support-url')}
                                    onChange={(e) =>
                                        setConfigState({
                                            ...configState,
                                            brandingSettings: {
                                                ...configState.brandingSettings,
                                                supportUrl: e.target.value
                                            }
                                        })
                                    }
                                    placeholder="https://t.me/support"
                                    value={configState.brandingSettings.supportUrl}
                                />
                            </Stack>
                        </Card>

                        <Card className={styles.sectionCard} p="lg" radius="lg">
                            <Stack gap="md" h="100%">
                                <Group gap="sm" justify="space-between">
                                    <BaseOverlayHeader
                                        IconComponent={IconGlobe}
                                        iconSize={20}
                                        iconVariant="gradient-teal"
                                        subtitle={t(
                                            'subpage-config-visual-editor.widget.additional-languages'
                                        )}
                                        title={t(
                                            'subpage-config-visual-editor.widget.localization'
                                        )}
                                        titleOrder={5}
                                    />

                                    <Badge color="teal" size="sm" variant="light">
                                        {configState.additionalLocales.length + 1} active
                                    </Badge>
                                </Group>

                                <Divider className={styles.divider} />

                                <SimpleGrid cols={2} spacing="xs">
                                    {LOCALE_DATA.map((locale) => (
                                        <LocaleCard
                                            key={locale.code}
                                            {...locale}
                                            isActive={isLocaleActive(locale.code, locale.isDefault)}
                                            onToggle={() =>
                                                toggleLocale(
                                                    locale.code as TSubscriptionPageConfigAdditionalLocales
                                                )
                                            }
                                        />
                                    ))}
                                </SimpleGrid>
                            </Stack>
                        </Card>
                    </SimpleGrid>

                    <Card className={styles.sectionCard} p="lg" radius="lg">
                        <Stack gap="md">
                            <Group justify="space-between">
                                <BaseOverlayHeader
                                    IconComponent={IconPhoto}
                                    iconSize={20}
                                    iconVariant="gradient-violet"
                                    subtitle={t(
                                        'subpage-config-visual-editor.widget.manage-your-svg-icons'
                                    )}
                                    title={t('svg-library-modal.component.svg-library')}
                                    titleOrder={5}
                                />
                                <Badge color="violet" size="sm" variant="light">
                                    {svgLibraryCount} icons
                                </Badge>
                            </Group>

                            <Divider className={styles.divider} />

                            <Button
                                className={styles.addButton}
                                fullWidth
                                leftSection={<IconPhoto size={16} />}
                                onClick={openSvgLibrary}
                                variant="default"
                            >
                                {t('subpage-config-visual-editor.widget.open-svg-library')}
                            </Button>
                        </Stack>
                    </Card>

                    <Card className={styles.sectionCard} p="lg" radius="lg">
                        <Stack gap="md">
                            <BaseOverlayHeader
                                IconComponent={IconPalette}
                                iconSize={20}
                                iconVariant="gradient-yellow"
                                title={t('subpage-config-visual-editor.widget.ui-configuration')}
                                titleOrder={5}
                            />

                            <Divider className={styles.divider} />

                            <Select
                                allowDeselect={false}
                                classNames={{ input: styles.selectDark }}
                                data={[
                                    {
                                        label: t('subpage-config-visual-editor.widget.collapsed'),
                                        value: 'collapsed'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.expanded'),
                                        value: 'expanded'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.cards'),
                                        value: 'cards'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.hidden'),
                                        value: 'hidden'
                                    }
                                ]}
                                label={t(
                                    'subpage-config-visual-editor.widget.subscription-info-block-design'
                                )}
                                onChange={(v) =>
                                    setConfigState({
                                        ...configState,
                                        uiConfig: {
                                            ...configState.uiConfig,
                                            subscriptionInfo: {
                                                block:
                                                    (v as TSubscriptionPageUiConfig['subscriptionInfo']['block']) ||
                                                    'collapsed'
                                            }
                                        }
                                    })
                                }
                                value={configState.uiConfig.subscriptionInfo.block}
                            />

                            <Select
                                allowDeselect={false}
                                classNames={{ input: styles.selectDark }}
                                data={[
                                    {
                                        label: t('subpage-config-visual-editor.widget.cards'),
                                        value: 'cards'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.accordion'),
                                        value: 'accordion'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.minimal'),
                                        value: 'minimal'
                                    },
                                    {
                                        label: t('subpage-config-visual-editor.widget.timeline'),
                                        value: 'timeline'
                                    }
                                ]}
                                label={t(
                                    'subpage-config-visual-editor.widget.installation-guides-design'
                                )}
                                onChange={(v) =>
                                    setConfigState({
                                        ...configState,
                                        uiConfig: {
                                            ...configState.uiConfig,
                                            installationGuides: {
                                                ...configState.uiConfig.installationGuides,
                                                block:
                                                    (v as TSubscriptionPageUiConfig['installationGuides']['block']) ||
                                                    'cards'
                                            }
                                        }
                                    })
                                }
                                value={configState.uiConfig.installationGuides.block || 'cards'}
                            />

                            <LocalizedTextEditor
                                enabledLocales={enabledLocales}
                                label={t(
                                    'subpage-config-visual-editor.widget.installation-guides-header'
                                )}
                                onChange={(headerText) =>
                                    setConfigState({
                                        ...configState,
                                        uiConfig: {
                                            ...configState.uiConfig,
                                            installationGuides: {
                                                ...configState.uiConfig.installationGuides,
                                                headerText
                                            }
                                        }
                                    })
                                }
                                value={configState.uiConfig.installationGuides.headerText}
                            />

                            <LocalizedTextEditor
                                enabledLocales={enabledLocales}
                                label={t(
                                    'subpage-config-visual-editor.widget.connection-keys-header'
                                )}
                                onChange={(headerText) =>
                                    setConfigState({
                                        ...configState,
                                        uiConfig: {
                                            ...configState.uiConfig,
                                            connectionKeys: { headerText }
                                        }
                                    })
                                }
                                value={configState.uiConfig.connectionKeys.headerText}
                            />
                        </Stack>
                    </Card>

                    <Card className={styles.sectionCard} p="lg" radius="lg">
                        <Stack gap="md">
                            <Group justify="space-between">
                                <BaseOverlayHeader
                                    IconComponent={IconDeviceDesktop}
                                    iconSize={20}
                                    iconVariant="gradient-violet"
                                    subtitle={t(
                                        'subpage-config-visual-editor.widget.configure-apps-for-each-platform'
                                    )}
                                    title={t('subpage-config-visual-editor.widget.platforms')}
                                    titleOrder={5}
                                />

                                {availablePlatformsToAdd.length > 0 && (
                                    <Select
                                        allowDeselect={false}
                                        classNames={{ input: styles.selectDark }}
                                        data={availablePlatformsToAdd}
                                        leftSection={<IconPlus size={14} />}
                                        onChange={(value) => {
                                            if (value)
                                                handleAddPlatform(
                                                    value as TSubscriptionPagePlatformKey
                                                )
                                        }}
                                        placeholder={t(
                                            'subpage-config-visual-editor.widget.add-platform'
                                        )}
                                        size="xs"
                                        value={null}
                                        w={150}
                                    />
                                )}
                            </Group>

                            <Divider className={styles.divider} />

                            {existingPlatforms.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <IconDeviceDesktop size={32} stroke={1.5} />
                                    <Text mt="sm" size="sm">
                                        {t(
                                            'subpage-config-visual-editor.widget.no-platforms-configured'
                                        )}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'subpage-config-visual-editor.widget.add-a-platform-to-get-started'
                                        )}
                                    </Text>
                                </div>
                            ) : (
                                <Accordion
                                    chevronPosition="right"
                                    className={styles.accordion}
                                    multiple
                                    variant="separated"
                                >
                                    {existingPlatforms.map((platformKey) => {
                                        const platform = configState.platforms[platformKey]
                                        if (!platform) return null
                                        return (
                                            <PlatformEditor
                                                enabledLocales={enabledLocales}
                                                key={platformKey}
                                                onChange={(p) =>
                                                    handlePlatformChange(platformKey, p)
                                                }
                                                onDelete={() => handlePlatformDelete(platformKey)}
                                                platform={platform}
                                                platformKey={platformKey}
                                                svgLibrary={configState.svgLibrary || {}}
                                            />
                                        )
                                    })}
                                </Accordion>
                            )}
                        </Stack>
                    </Card>
                </Stack>
            </div>

            <SvgLibraryModal
                onChange={(svgLibrary) => setConfigState({ ...configState, svgLibrary })}
                onClose={closeSvgLibrary}
                opened={svgLibraryOpened}
                svgLibrary={configState.svgLibrary || {}}
            />
        </Box>
    )
}
