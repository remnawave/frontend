import {
    ActionIcon,
    Box,
    Button,
    CopyButton,
    FileButton,
    Group,
    SimpleGrid,
    Stack,
    Tooltip
} from '@mantine/core'
import {
    TbArrowBack,
    TbCloudDownload,
    TbDeviceFloppy,
    TbDownload,
    TbFile,
    TbPalette,
    TbUpload
} from 'react-icons/tb'
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
import { useForm } from '@mantine/form'

import {
    BaseTranslationsBlockComponent,
    BrandingBlockComponent,
    LocalizationBlockComponent,
    PlatformBlockComponent,
    SvgLibraryBlockComponent,
    UiConfigBlockComponent
} from '@widgets/dashboard/subpage-configs/subpage-config-editor/editor-base'
import {
    showSubpageConfigSavedModal,
    showValidationErrorsModal
} from '@widgets/dashboard/subpage-configs/subpage-config-editor/modals'
import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { QueryKeys, useUpdateSubscriptionPageConfig } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { queryClient } from '@shared/api/query-client'
import { Page, PageHeaderShared } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import styles from './subpage-config-editor-page.module.css'

interface Props {
    config: GetSubscriptionPageConfigCommand.Response['response']
}

export const SubpageConfigEditorPageComponent = (props: Props) => {
    const { config } = props
    const { t } = useTranslation()
    const navigate = useNavigate()

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

    const handleImportConfig = (file: File | null) => {
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const configData = JSON.parse(e.target?.result as string)
                const validatedConfig = SubscriptionPageRawConfigSchema.safeParse(configData)

                if (!validatedConfig.success) {
                    const errors = validatedConfig.error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                    showValidationErrorsModal(errors)
                    return
                }

                form.setValues(validatedConfig.data)
                notifications.show({
                    title: 'Success',
                    message: 'Config imported successfully',
                    color: 'teal'
                })
            } catch {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to parse config file',
                    color: 'red'
                })
            }
        }

        reader.readAsText(file)
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

                        <FileButton accept="application/json,.json" onChange={handleImportConfig}>
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
            <Box className={styles.editorWrapper}>
                <Box className={styles.headerWrapper}>
                    <Group justify="space-between">
                        <Group gap="sm">
                            <BaseOverlayHeader
                                IconComponent={TbPalette}
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
                    </Group>
                </Box>

                <Stack gap="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <BrandingBlockComponent form={form} />
                        <LocalizationBlockComponent form={form} />
                    </SimpleGrid>
                    <SvgLibraryBlockComponent form={form} />
                    <BaseTranslationsBlockComponent form={form} />
                    <UiConfigBlockComponent form={form} />
                    <PlatformBlockComponent form={form} />
                </Stack>
            </Box>
        </Page>
    )
}
