import {
    TbArrowBack,
    TbCheck,
    TbCloudDownload,
    TbDeviceFloppy,
    TbDownload,
    TbFile,
    TbFileImport,
    TbPalette,
    TbUpload
} from 'react-icons/tb'
import {
    ActionIcon,
    Button,
    CopyButton,
    FileButton,
    Group,
    SimpleGrid,
    Stack,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import {
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { GetSubscriptionPageConfigCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { useRef } from 'react'

import {
    BaseSettingsBlockComponent,
    BaseTranslationsBlockComponent,
    BrandingBlockComponent,
    LocalizationBlockComponent,
    PlatformBlockComponent,
    SvgLibraryBlockComponent,
    UiConfigBlockComponent
} from '@widgets/dashboard/subpage-configs/subpage-config-editor/editor-base'
import {
    ImportConfigSectionsModalContent,
    ImportMode,
    showSubpageConfigSavedModal,
    showValidationErrorsModal
} from '@widgets/dashboard/subpage-configs/subpage-config-editor/modals'
import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { QueryKeys, useUpdateSubscriptionPageConfig } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { queryClient } from '@shared/api/query-client'
import { Page, PageHeaderShared } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { sleep } from '@shared/utils/misc'

import styles from './subpage-config-editor-page.module.css'

interface Props {
    config: GetSubscriptionPageConfigCommand.Response['response']
}

export const SubpageConfigEditorPageComponent = (props: Props) => {
    const { config } = props
    const { t } = useTranslation()
    const navigate = useNavigate()

    const resetRef = useRef<() => void>(null)
    const form = useForm<TSubscriptionPageRawConfig>({
        mode: 'uncontrolled',
        initialValues: config.config as TSubscriptionPageRawConfig,
        validate: zodResolver(SubscriptionPageRawConfigSchema)
    })

    const { mutate: updateSubscriptionPageConfig, isPending: isUpdatingSubscriptionPageConfig } =
        useUpdateSubscriptionPageConfig({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        QueryKeys.subpageConfigs.getSubscriptionPageConfig({
                            uuid: config.uuid
                        }).queryKey,
                        data
                    )
                    form.resetDirty()

                    showSubpageConfigSavedModal(t)
                }
            }
        })

    const handleDownloadConfig = () => {
        const dataStr = JSON.stringify(form.getValues(), null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportFileDefaultName = `subpage-${config.uuid}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const handleSave = () => {
        const validation = form.validate()
        if (validation.hasErrors) {
            const errors = Object.entries(validation.errors)
                .filter(([_, value]) => value)
                .map(([path, message]) => ({ path, message: String(message) }))

            showValidationErrorsModal(errors)
            return
        }

        updateSubscriptionPageConfig({
            variables: { uuid: config.uuid, config: form.getValues() }
        })
    }

    const mergeSvgLibrary = (
        current: Record<string, string>,
        imported: Record<string, string>
    ): Record<string, string> => {
        return { ...current, ...imported }
    }

    const handleImportByMode = async (
        importedConfig: TSubscriptionPageRawConfig,
        mode: ImportMode
    ) => {
        notifications.show({
            id: 'import-config',
            loading: true,
            color: 'cyan',
            title: t('subpage-config-editor-page.component.importing-config'),
            message: t('subpage-config-editor-page.component.this-may-take-a-while'),
            autoClose: false,
            withCloseButton: false
        })

        const currentSvgLibrary = form.getValues().svgLibrary || {}

        switch (mode) {
            case 'baseTranslations': {
                form.setValues({
                    baseTranslations: importedConfig.baseTranslations,
                    locales: importedConfig.locales
                })
                break
            }
            case 'full': {
                form.setValues(importedConfig)
                break
            }
            case 'platforms': {
                form.setValues({
                    platforms: importedConfig.platforms,
                    locales: importedConfig.locales,
                    baseTranslations: importedConfig.baseTranslations,
                    svgLibrary: mergeSvgLibrary(currentSvgLibrary, importedConfig.svgLibrary || {})
                })
                break
            }
            case 'svgLibrary': {
                form.setValues({
                    svgLibrary: mergeSvgLibrary(currentSvgLibrary, importedConfig.svgLibrary || {})
                })

                break
            }
            default:
                break
        }

        notifications.update({
            id: 'import-config',
            loading: false,
            title: t('subpage-config-editor-page.component.success'),
            message: t('subpage-config-editor-page.component.config-imported-successfully'),
            icon: <TbCheck size={18} />,
            autoClose: 3000,
            color: 'teal'
        })
    }

    const handleImportConfig = async (file: File | null) => {
        if (!file) return

        try {
            const content = await file.text()
            const configData = JSON.parse(content)
            const validatedConfig = SubscriptionPageRawConfigSchema.safeParse(configData)

            if (!validatedConfig.success) {
                const errors = validatedConfig.error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
                showValidationErrorsModal(errors)
                return
            }

            await sleep(100)

            modals.open({
                title: (
                    <BaseOverlayHeader
                        IconComponent={TbFileImport}
                        iconSize={20}
                        iconVariant="gradient-cyan"
                        title={t('subpage-config-editor-page.component.import-config')}
                        titleOrder={5}
                    />
                ),
                children: (
                    <ImportConfigSectionsModalContent
                        currentConfig={form.getValues()}
                        importedConfig={validatedConfig.data}
                        onImport={(mode) => handleImportByMode(validatedConfig.data, mode)}
                    />
                ),
                centered: true,
                size: 'lg'
            })
        } catch {
            notifications.show({
                title: t('subpage-config-editor-page.component.error'),
                message: t('subpage-config-editor-page.component.failed-to-parse-config-file'),
                color: 'red'
            })
        } finally {
            resetRef.current?.()
        }
    }

    const { openDownloadModal } = useDownloadTemplate({
        editorType: 'SUBPAGE_CONFIG',
        templateType: 'SUBPAGE_CONFIG',
        onLoadTemplate: async (content) => {
            handleImportConfig(new File([content], 'config.json'))
        }
    })

    return (
        <Page title={config.name}>
            <PageHeaderShared
                actions={
                    <Group>
                        {/* <HelpActionIconShared
                            hidden={!isHelpDrawerVisible}
                            screen="EDITOR_TEMPLATES_XRAY_JSON"
                        /> */}

                        <FileButton
                            accept="application/json,.json"
                            onChange={handleImportConfig}
                            resetRef={resetRef}
                        >
                            {(props) => (
                                <Tooltip
                                    label={t('subpage-config-editor-page.component.import-config')}
                                >
                                    <ActionIcon
                                        color="gray"
                                        size="input-md"
                                        variant="light"
                                        {...props}
                                    >
                                        <TbUpload size={24} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </FileButton>

                        <Tooltip label={t('subpage-config-editor-page.component.download-config')}>
                            <ActionIcon
                                color="gray"
                                onClick={handleDownloadConfig}
                                size="input-md"
                                variant="light"
                            >
                                <TbDownload size={24} />
                            </ActionIcon>
                        </Tooltip>

                        <CopyButton timeout={2000} value={config.uuid}>
                            {({ copied, copy }) => (
                                <Tooltip label={t('common.copy-uuid')}>
                                    <ActionIcon
                                        color={copied ? 'teal' : 'gray'}
                                        onClick={copy}
                                        size="input-md"
                                        variant="light"
                                    >
                                        {copied ? <PiCheck size={24} /> : <PiCopy size={24} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>

                        <ActionIcon
                            color="gray"
                            onClick={() => navigate(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.ROOT)}
                            size="input-md"
                            variant="light"
                        >
                            <TbArrowBack size={24} />
                        </ActionIcon>
                    </Group>
                }
                description={config.uuid}
                icon={<TbFile size={24} />}
                title={config.name}
            />

            <PageHeaderShared
                actions={
                    <Group justify="space-between">
                        <Button
                            className={styles.saveButton}
                            leftSection={<TbCloudDownload size={24} />}
                            onClick={openDownloadModal}
                            size="md"
                            variant="light"
                        >
                            {t('subpage-config-visual-editor.widget.load-from-github')}
                        </Button>

                        <Button
                            className={styles.saveButton}
                            disabled={isUpdatingSubscriptionPageConfig}
                            leftSection={<TbDeviceFloppy size={24} />}
                            loading={isUpdatingSubscriptionPageConfig}
                            onClick={handleSave}
                            size="md"
                            variant="light"
                        >
                            {t('common.save')}
                        </Button>
                    </Group>
                }
                className={styles.headerCard}
                customThemeIcon={
                    <ThemeIcon size="lg" variant="gradient-cyan">
                        <TbPalette size={24} />
                    </ThemeIcon>
                }
                description={t(
                    'subpage-config-visual-editor.widget.edit-your-subscription-page-configuration'
                )}
                title={t('subpage-config-visual-editor.widget.subpage-editor')}
            />

            <Stack gap="lg">
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    <BrandingBlockComponent form={form} />
                    <LocalizationBlockComponent form={form} />
                </SimpleGrid>
                <BaseSettingsBlockComponent form={form} />
                <SvgLibraryBlockComponent form={form} />
                <BaseTranslationsBlockComponent form={form} />
                <UiConfigBlockComponent form={form} />
                <PlatformBlockComponent form={form} />
            </Stack>
        </Page>
    )
}
