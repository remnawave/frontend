import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Box, Button, Group, Modal, Paper, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
    CreateNodeIntegrationCommand,
    UpdateNodeIntegrationCommand
} from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlugConnected } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { openApplyToNodesModal } from '@shared/_modals/universal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useCreateNodeIntegration,
    useGetNodeIntegration,
    useUpdateNodeIntegration
} from '@shared/api/hooks'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'
import { addBase64EditorAction } from '@shared/utils/monaco/base64-action'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './NodeIntegrationEditor.module.css'

const EMPTY_CONFIG = '{}'

interface IProps {
    integrationUuid?: string
}

interface IFormValues {
    description?: null | string
    name: string
}

export const NodeIntegrationEditorModal = NiceModal.create((props: IProps) => {
    const { integrationUuid } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const isEditMode = Boolean(integrationUuid)
    const isFormInitialized = useRef(false)

    const [configValue, setConfigValue] = useState(EMPTY_CONFIG)
    const [configError, setConfigError] = useState<null | string>(null)

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const form = useForm<IFormValues>({
        name: 'node-integration-form',
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: ''
        },
        validate: schemaResolver(
            CreateNodeIntegrationCommand.RequestBodySchema.omit({
                config: true
            })
        )
    })

    const { data: integration, isLoading } = useGetNodeIntegration({
        route: { uuid: integrationUuid ?? '' },
        rQueryParams: { enabled: isEditMode }
    })

    useEffect(() => {
        if (!integration || isFormInitialized.current) {
            return
        }

        isFormInitialized.current = true

        form.initialize({
            name: integration.name,
            description: integration.description ?? ''
        })

        setConfigValue(JSON.stringify(integration.config ?? {}, null, 2))
    }, [integration])

    const invalidateIntegrations = () => {
        queryClient.refetchQueries({
            queryKey: QueryKeys.nodeIntegrations.getNodeIntegrations.queryKey
        })

        if (integrationUuid) {
            queryClient.refetchQueries({
                queryKey: QueryKeys.nodeIntegrations.getNodeIntegration({ uuid: integrationUuid })
                    .queryKey
            })
        }
    }

    const { mutate: createNodeIntegration, isPending: isCreatePending } = useCreateNodeIntegration({
        mutationFns: {
            onSuccess: () => {
                invalidateIntegrations()
                hide()
            },
            onError: (error) => handleFormErrors(form, error)
        }
    })

    const { mutate: updateNodeIntegration, isPending: isUpdatePending } = useUpdateNodeIntegration({
        mutationFns: {
            onSuccess: () => {
                invalidateIntegrations()
                hide()
            },
            onError: (error) => handleFormErrors(form, error)
        }
    })

    const parseConfig = (): null | Record<string, unknown> => {
        try {
            const parsed = JSON.parse(configValue || EMPTY_CONFIG)

            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                setConfigError(t('node-integrations.editor.config-must-be-an-object'))
                return null
            }

            setConfigError(null)
            return parsed as Record<string, unknown>
        } catch (error) {
            setConfigError(error instanceof Error ? error.message : 'Invalid JSON')
            return null
        }
    }

    const openRestartChoiceModal = (variables: UpdateNodeIntegrationCommand.RequestBody) => {
        openApplyToNodesModal({
            IconComponent: TbPlugConnected,
            iconColor: 'pink',
            onApply: () =>
                updateNodeIntegration({ variables: { ...variables, restartNodes: true } }),
            onLater: () =>
                updateNodeIntegration({ variables: { ...variables, restartNodes: false } })
        })
    }

    const handleSubmit = form.onSubmit((values) => {
        const config = parseConfig()

        if (!config) {
            return
        }

        const description = values.description?.trim() ? values.description.trim() : null

        if (integrationUuid) {
            openRestartChoiceModal({
                uuid: integrationUuid,
                name: values.name.trim(),
                description,
                config
            })

            return
        }

        createNodeIntegration({
            variables: {
                name: values.name.trim(),
                description,
                config
            }
        })
    })

    return (
        <Modal
            {...modalProps}
            transitionProps={{ transition: 'fade', duration: 200 }}
            size="900px"
            title={
                <BaseOverlayHeader
                    iconColor="pink"
                    IconComponent={TbPlugConnected}
                    iconVariant="soft"
                    title={t('node-integrations.modal.title')}
                />
            }
        >
            {isEditMode && isLoading && <LoaderModalShared mih="50vh" />}

            {(!isEditMode || !isLoading) && (
                <form onSubmit={handleSubmit}>
                    <Box
                        className={clsx(
                            classes.container,
                            isFullscreen && fullscreenClasses.overlay
                        )}
                    >
                        {!isFullscreen && (
                            <TextInput
                                key={form.key('name')}
                                label={t('common.field.name')}
                                placeholder="Integration"
                                required
                                {...form.getInputProps('name')}
                            />
                        )}

                        {!isFullscreen && (
                            <TextInput
                                key={form.key('description')}
                                label={t('common.field.description')}
                                placeholder={t('node-integrations.editor.description-placeholder')}
                                {...form.getInputProps('description')}
                            />
                        )}

                        <div
                            className={clsx(
                                editorClasses.editorGroup,
                                isFullscreen && fullscreenClasses.fill
                            )}
                        >
                            <Paper
                                className={clsx(
                                    classes.editorWrapper,
                                    editorClasses.editorAttached,
                                    isFullscreen && fullscreenClasses.fill
                                )}
                                p={0}
                                pos="relative"
                                withBorder
                            >
                                <CodeEditor
                                    defaultLanguage="json"
                                    footer={
                                        configError && (
                                            <EditorStatusBar status="error">
                                                {configError}
                                            </EditorStatusBar>
                                        )
                                    }
                                    onChange={(value) => {
                                        setConfigValue(value ?? '')
                                        setConfigError(null)
                                    }}
                                    onMount={(editor) => {
                                        forceMonacoRetokenize(editor)

                                        addBase64EditorAction(
                                            editor,
                                            (request) => showModal('base64EditorModal', request),
                                            (message) =>
                                                notifications.show({
                                                    color: 'gray',
                                                    message,
                                                    title: 'Base64 editor'
                                                })
                                        )
                                    }}
                                    options={{
                                        ...COMPACT_MONACO_OPTIONS,
                                        quickSuggestions: false,
                                        suggestOnTriggerCharacters: false,
                                        wordBasedSuggestions: 'off'
                                    }}
                                    path="node-integration://*"
                                    value={configValue}
                                />
                            </Paper>

                            <EditorFooter>
                                <FullscreenToggleButton
                                    floating={false}
                                    isFullscreen={isFullscreen}
                                    onToggle={toggleFullscreen}
                                    size={36}
                                />

                                <Group>
                                    <Button
                                        loading={isCreatePending || isUpdatePending}
                                        type="submit"
                                        variant="soft"
                                    >
                                        {t('common.action.save')}
                                    </Button>
                                    <Button onClick={hide} variant="subtle">
                                        {t('common.action.cancel')}
                                    </Button>
                                </Group>
                            </EditorFooter>
                        </div>
                    </Box>
                </form>
            )}
        </Modal>
    )
})
