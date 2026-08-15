import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Code, Group, Modal, Paper, Stack, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import Editor, { Monaco } from '@monaco-editor/react'
import {
    CreateNodeIntegrationCommand,
    UpdateNodeIntegrationCommand
} from '@remnawave/backend-contract'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy, TbPlugConnected, TbRocket } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useCreateNodeIntegration,
    useGetNodeIntegration,
    useUpdateNodeIntegration
} from '@shared/api/hooks'
import { monacoTheme } from '@shared/constants/monaco-theme'
import { ActionCardShared } from '@shared/ui'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

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
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="pink"
                    IconComponent={TbPlugConnected}
                    iconVariant="soft"
                    title={t('node-integrations.editor.apply-to-nodes')}
                />
            ),
            centered: true,
            size: 'md',
            children: (
                <Stack gap="sm">
                    <ActionCardShared
                        description={t('node-integrations.editor.save-and-restart-description')}
                        icon={<TbRocket size={22} />}
                        iconColor="teal"
                        onClick={() => {
                            updateNodeIntegration({
                                variables: { ...variables, restartNodes: true }
                            })
                            modals.closeAll()
                        }}
                        title={t('node-integrations.editor.save-and-restart')}
                        variant="soft"
                    />

                    <ActionCardShared
                        description={t('node-integrations.editor.save-without-restart-description')}
                        icon={<TbDeviceFloppy size={22} />}
                        iconColor="gray"
                        onClick={() => {
                            updateNodeIntegration({
                                variables: { ...variables, restartNodes: false }
                            })
                            modals.closeAll()
                        }}
                        title={t('node-integrations.editor.save-without-restart')}
                        variant="soft"
                    />
                </Stack>
            )
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

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
    }

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
            {isEditMode && isLoading && <LoaderModalShared h="50vh" />}

            {(!isEditMode || !isLoading) && (
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            key={form.key('name')}
                            label={t('node-integrations.editor.name')}
                            placeholder="Integration"
                            required
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            key={form.key('description')}
                            label={t('node-integrations.editor.description')}
                            placeholder={t('node-integrations.editor.description-placeholder')}
                            {...form.getInputProps('description')}
                        />

                        <Paper h={400} p={0} radius="sm" style={{ overflow: 'hidden' }} withBorder>
                            <Editor
                                beforeMount={handleEditorWillMount}
                                defaultLanguage="json"
                                height="100%"
                                loading="Editor is loading..."
                                onChange={(value) => {
                                    setConfigValue(value ?? '')
                                    setConfigError(null)
                                }}
                                onMount={(editor) => {
                                    forceMonacoRetokenize(editor)
                                }}
                                options={{
                                    autoClosingBrackets: 'always',
                                    autoClosingQuotes: 'always',
                                    autoIndent: 'full',
                                    automaticLayout: true,
                                    bracketPairColorization: {
                                        enabled: true,
                                        independentColorPoolPerBracketType: true
                                    },
                                    detectIndentation: true,
                                    fixedOverflowWidgets: true,
                                    folding: true,
                                    fontSize: 14,
                                    hover: { above: false },
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    guides: {
                                        bracketPairs: true,
                                        indentation: true
                                    },
                                    insertSpaces: true,
                                    minimap: { enabled: false },
                                    quickSuggestions: false,
                                    suggestOnTriggerCharacters: false,
                                    wordBasedSuggestions: 'off',
                                    renderLineHighlight: 'all',
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    tabSize: 2,
                                    padding: {
                                        top: 10,
                                        bottom: 10
                                    }
                                }}
                                path="node-integration://*"
                                theme="GithubDark"
                                value={configValue}
                            />
                        </Paper>

                        {configError && (
                            <Paper
                                p="md"
                                radius="sm"
                                style={{
                                    backgroundColor: 'rgba(241, 65, 65, 0.1)',
                                    border: `1px solid rgb(241, 65, 65)`
                                }}
                            >
                                <Code
                                    color="red"
                                    style={{
                                        backgroundColor: 'transparent',
                                        fontSize: '0.9rem',
                                        padding: 0
                                    }}
                                >
                                    {configError}
                                </Code>
                            </Paper>
                        )}

                        <Group justify="flex-end">
                            <Button onClick={hide} variant="subtle">
                                {t('common.cancel')}
                            </Button>
                            <Button
                                loading={isCreatePending || isUpdatePending}
                                type="submit"
                                variant="soft"
                            >
                                {t('common.save')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            )}
        </Modal>
    )
})
