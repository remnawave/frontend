import type { editor } from 'monaco-editor'

import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Code,
    CopyButton,
    Divider,
    Group,
    Loader,
    Modal,
    Paper,
    ScrollArea,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { CreateSnippetCommand, UpdateSnippetCommand } from '@remnawave/backend-contract'
import { TbBraces, TbCode, TbPlus, TbRefresh, TbTrash, TbX } from 'react-icons/tb'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'

import {
    QueryKeys,
    useCreateSnippet,
    useDeleteSnippet,
    useGetSnippets,
    useUpdateSnippet
} from '@shared/api/hooks'
import { MonacoSetupSnippetsFeature } from '@features/dashboard/config-profiles/monaco-setup/monaco-setup.feature'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { queryClient } from '@shared/api'

import classes from './SnippetsDrawer.module.css'

export const SnippetsDrawerWidget = () => {
    const { t, i18n } = useTranslation()

    const { isOpen } = useModalState(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)
    const close = useModalClose(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)

    const monacoRef = useRef<Monaco | null>(null)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        if (!monacoRef.current) return

        MonacoSetupSnippetsFeature.setup(monacoRef.current, i18n.language)
    }, [monacoRef.current, i18n.language])

    const isMobile = useMediaQuery('(max-width: 1200px)')

    const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] =
        useDisclosure(false)
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false)

    const createSnippetForm = useForm<CreateSnippetCommand.Request>({
        name: 'create-snippet-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: zodResolver(CreateSnippetCommand.RequestSchema),
        initialValues: {
            name: '',
            snippet: []
        }
    })

    const editSnippetForm = useForm<UpdateSnippetCommand.Request>({
        name: 'edit-snippet-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: zodResolver(UpdateSnippetCommand.RequestSchema),
        initialValues: {
            name: '',
            snippet: []
        }
    })

    const { data: snippets, isLoading } = useGetSnippets({
        rQueryParams: {
            enabled: !!isOpen
        }
    })

    const { mutate: updateSnippet, isPending: isUpdating } = useUpdateSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
                closeEditModal()
            }
        }
    })

    const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
            }
        }
    })

    const { mutate: createSnippet, isPending: isCreating } = useCreateSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
                closeCreateModal()
            }
        }
    })

    const handleCreate = (values: CreateSnippetCommand.Request) => {
        if (!editorRef.current) return

        let currentValue = editorRef.current.getValue()

        try {
            currentValue = JSON.parse(currentValue)
        } catch {
            createSnippetForm.setFieldError('snippet', t('snippets.drawer.widget.invalid-json'))
            return
        }

        if (!Array.isArray(currentValue) || currentValue.length === 0) {
            createSnippetForm.setFieldError(
                'snippet',
                t('snippets.drawer.widget.snippet-cannot-be-empty')
            )
            return
        }

        if (currentValue.some((item) => Object.keys(item).length === 0)) {
            createSnippetForm.setFieldError(
                'snippet',
                t('snippets.drawer.widget.snippet-cannot-contain-empty-objects')
            )
            return
        }

        createSnippet({
            variables: {
                name: values.name,
                snippet: currentValue
            }
        })
    }

    const handleUpdate = (values: UpdateSnippetCommand.Request) => {
        if (!editorRef.current) return

        let currentValue = editorRef.current.getValue()

        try {
            currentValue = JSON.parse(currentValue)
        } catch {
            editSnippetForm.setFieldError('snippet', t('snippets.drawer.widget.invalid-json'))
            return
        }

        if (!Array.isArray(currentValue) || currentValue.length === 0) {
            editSnippetForm.setFieldError(
                'snippet',
                t('snippets.drawer.widget.snippet-cannot-be-empty')
            )
            return
        }

        if (currentValue.some((item) => Object.keys(item).length === 0)) {
            editSnippetForm.setFieldError(
                'snippet',
                t('snippets.drawer.widget.snippet-cannot-contain-empty-objects')
            )
            return
        }

        updateSnippet({
            variables: {
                name: values.name,
                snippet: currentValue
            }
        })
    }

    const handleDelete = (name: string) => {
        deleteSnippet({
            variables: {
                name
            }
        })
    }

    const handleEdit = (snippet: UpdateSnippetCommand.Response['response']['snippets'][number]) => {
        editSnippetForm.setValues({
            name: snippet.name,
            snippet: snippet.snippet as unknown as UpdateSnippetCommand.Request['snippet']
        })
        openEditModal()
    }

    const handleOpenCreate = () => {
        createSnippetForm.reset()
        openCreateModal()
    }

    const returnLoading = () => {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">{t('snippets.drawer.widget.fetching-snippets')}</Text>
                </Stack>
            </Center>
        )
    }

    const getSnippetPreview = (snippet: unknown) => {
        if (!Array.isArray(snippet)) return []
        return snippet.slice(0, 3)
    }

    const getSnippetLength = (snippet: unknown) => {
        if (!Array.isArray(snippet)) return 0
        return snippet.length
    }

    const openSnippetsHelpModal = () => {
        modals.open({
            title: t('snippets.drawer.widget.snippets'),
            children: (
                <Stack gap="md">
                    <Stack gap="sm">
                        <Stack gap={0}>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-1')}
                            </Text>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-2')}
                            </Text>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-3')}
                            </Text>
                        </Stack>

                        <Stack gap={0}>
                            <Text fw={600} mb={4} size="sm">
                                Outbounds
                            </Text>
                            <Text c="dimmed" mb={6} size="xs">
                                {t('snippets.drawer.widget.snippets-help-line-4')}
                            </Text>
                            <Code block color="dark.8">
                                {JSON.stringify(
                                    {
                                        outbounds: [
                                            {
                                                snippet: 'snippet-name'
                                            }
                                        ]
                                    },
                                    null,
                                    2
                                )}
                            </Code>
                        </Stack>

                        <Stack gap={0}>
                            <Text fw={600} mb={4} size="sm">
                                Routing → Rules
                            </Text>
                            <Text c="dimmed" mb={6} size="xs">
                                {t('snippets.drawer.widget.snippets-help-line-5')}
                            </Text>
                            <Code block color="dark.8">
                                {JSON.stringify(
                                    {
                                        routing: {
                                            rules: [
                                                {
                                                    snippet: 'snippet-name'
                                                }
                                            ]
                                        }
                                    },
                                    null,
                                    2
                                )}
                            </Code>
                        </Stack>
                    </Stack>
                </Stack>
            )
        })
    }

    const renderSnippets = () => {
        if (!snippets || snippets.snippets.length === 0) {
            return (
                <Center h={200}>
                    <Stack align="center" gap="md">
                        <TbCode opacity={0.3} size={48} />
                        <Text c="dimmed" size="sm">
                            {t('snippets.drawer.widget.no-snippets-yet')}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        return (
            <Stack gap="xs">
                {snippets.snippets.map((snippet) => {
                    const snippetLength = getSnippetLength(snippet.snippet)
                    const preview = getSnippetPreview(snippet.snippet)

                    return (
                        <Card
                            className={classes.snippetCard}
                            key={snippet.name}
                            onClick={() => handleEdit(snippet)}
                            padding="sm"
                            shadow="sm"
                            withBorder
                        >
                            <Stack gap="xs">
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group gap={6} style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                                        <TbBraces
                                            color="var(--mantine-color-blue-5)"
                                            size={16}
                                            style={{ flexShrink: 0 }}
                                        />

                                        <CopyButton timeout={1500} value={snippet.name}>
                                            {({ copied, copy }) => (
                                                <Text
                                                    fw={500}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        copy()
                                                    }}
                                                    size="sm"
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        cursor: 'copy',
                                                        flex: 1,
                                                        minWidth: 0,
                                                        transition: 'color 0.1s ease',
                                                        color: copied
                                                            ? 'var(--mantine-color-teal-4)'
                                                            : 'inherit'
                                                    }}
                                                >
                                                    {snippet.name}
                                                </Text>
                                            )}
                                        </CopyButton>

                                        <Badge
                                            color="blue"
                                            radius="sm"
                                            size="md"
                                            style={{ flexShrink: 0 }}
                                            variant="default"
                                        >
                                            {snippetLength}
                                        </Badge>
                                    </Group>

                                    <Group gap={4} wrap="nowrap">
                                        <CopyButton
                                            timeout={2000}
                                            value={JSON.stringify(snippet.snippet || [], null, 2)}
                                        >
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        copy()
                                                    }}
                                                    size="sm"
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="16px" />
                                                    ) : (
                                                        <PiCopy size="16px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>

                                        <ActionIcon
                                            color="red"
                                            loading={isDeleting}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(snippet.name)
                                            }}
                                            size="sm"
                                            variant="subtle"
                                        >
                                            <TbTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>

                                {preview.length > 0 && (
                                    <>
                                        <Divider />
                                        <Stack gap={4}>
                                            {preview.map((item, idx) => (
                                                <Box key={idx}>
                                                    <Code
                                                        block
                                                        style={{
                                                            fontSize: '11px',
                                                            maxWidth: '100%',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {JSON.stringify(item)}
                                                    </Code>
                                                </Box>
                                            ))}
                                            {snippetLength > 3 && (
                                                <Text c="dimmed" fs="italic" size="xs">
                                                    +{snippetLength - 3}{' '}
                                                    {t('snippets.drawer.widget.more-items')}
                                                </Text>
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    )
                })}
            </Stack>
        )
    }

    const renderCreateModal = () => (
        <Modal
            centered
            closeOnClickOutside={!isCreating}
            closeOnEscape={!isCreating}
            onClose={() => {
                createSnippetForm.reset()
                closeCreateModal()
            }}
            opened={createModalOpened}
            size="lg"
            title={t('snippets.drawer.widget.create-snippet')}
        >
            <form onSubmit={createSnippetForm.onSubmit(handleCreate)}>
                <Stack gap="md">
                    <TextInput
                        key={createSnippetForm.key('name')}
                        label={t('snippets.drawer.widget.snippet-name')}
                        placeholder={t(
                            'snippets.drawer.widget.enter-snippet-name-cannot-be-changed-later'
                        )}
                        required
                        {...createSnippetForm.getInputProps('name')}
                    />

                    <Paper
                        p={0}
                        style={{
                            border: createSnippetForm.getInputProps('snippet').error
                                ? '1px solid var(--mantine-color-red-5)'
                                : '1px solid var(--mantine-color-dark-4)'
                        }}
                        withBorder
                    >
                        <MonacoEditor
                            height={400}
                            language="json"
                            onChange={(value) => {
                                try {
                                    JSON.parse(value || '[]')

                                    createSnippetForm.clearErrors()
                                } catch {
                                    createSnippetForm.setFieldError(
                                        'snippet',
                                        t('snippets.drawer.widget.invalid-json')
                                    )
                                }
                            }}
                            onMount={(editor, monaco) => {
                                monacoRef.current = monaco
                                editorRef.current = editor
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
                                folding: true,
                                foldingStrategy: 'indentation',
                                fontSize: 14,
                                formatOnPaste: true,
                                guides: {
                                    bracketPairs: true,
                                    indentation: true
                                },
                                insertSpaces: true,

                                minimap: { enabled: false },
                                readOnly: isCreating,
                                scrollBeyondLastLine: true,
                                scrollbar: {
                                    alwaysConsumeMouseWheel: false
                                },
                                smoothScrolling: true,
                                tabSize: 2
                            }}
                            path="snippet://*"
                            theme="GithubDark"
                            value={JSON.stringify(
                                createSnippetForm.getValues().snippet || [],
                                null,
                                2
                            )}
                        />
                    </Paper>

                    <Paper
                        mb="md"
                        p="md"
                        radius="sm"
                        style={{
                            backgroundColor: createSnippetForm.getInputProps('snippet').error
                                ? 'rgba(241, 65, 65, 0.1)'
                                : 'rgba(51, 171, 132, 0.1)',
                            border: `1px solid ${createSnippetForm.getInputProps('snippet').error ? 'rgb(241, 65, 65)' : 'rgb(51, 171, 132)'}`
                        }}
                    >
                        <Code
                            block
                            color={
                                createSnippetForm.getInputProps('snippet').error ? 'red' : 'teal'
                            }
                            style={{
                                backgroundColor: 'transparent',
                                fontSize: '0.9rem',
                                padding: 0
                            }}
                        >
                            {createSnippetForm.getInputProps('snippet').error ||
                                t('snippets.drawer.widget.snippet-is-valid')}
                        </Code>
                    </Paper>

                    <Group gap="sm" justify="flex-end">
                        <Button
                            disabled={isCreating}
                            onClick={() => {
                                createSnippetForm.reset()
                                closeCreateModal()
                            }}
                            variant="subtle"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button loading={isCreating} type="submit">
                            {t('common.create')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )

    const renderEditModal = () => (
        <Modal
            centered
            closeOnClickOutside={!isUpdating}
            closeOnEscape={!isUpdating}
            onClose={() => {
                editSnippetForm.reset()
                closeEditModal()
            }}
            opened={editModalOpened}
            size="lg"
            title={t('snippets.drawer.widget.edit-snippet')}
        >
            <form onSubmit={editSnippetForm.onSubmit(handleUpdate)}>
                <Stack gap="md">
                    <CopyableFieldShared
                        label={t('snippets.drawer.widget.snippet-name')}
                        value={editSnippetForm.getValues().name}
                    />

                    <Paper
                        p={0}
                        style={{
                            border: createSnippetForm.getInputProps('snippet').error
                                ? '1px solid var(--mantine-color-red-5)'
                                : '1px solid var(--mantine-color-dark-4)'
                        }}
                        withBorder
                    >
                        <MonacoEditor
                            height={400}
                            language="json"
                            onChange={(value) => {
                                try {
                                    JSON.parse(value || '[]')

                                    editSnippetForm.clearErrors()
                                } catch {
                                    editSnippetForm.setFieldError(
                                        'snippet',
                                        t('snippets.drawer.widget.invalid-json')
                                    )
                                }
                            }}
                            onMount={(editor, monaco) => {
                                monacoRef.current = monaco
                                editorRef.current = editor
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
                                folding: true,
                                foldingStrategy: 'indentation',
                                fontSize: 14,
                                formatOnPaste: true,

                                guides: {
                                    bracketPairs: true,
                                    indentation: true
                                },
                                insertSpaces: true,

                                minimap: { enabled: false },
                                readOnly: isUpdating,
                                scrollBeyondLastLine: true,
                                scrollbar: {
                                    alwaysConsumeMouseWheel: false
                                },
                                smoothScrolling: true,
                                tabSize: 2
                            }}
                            path="snippet://*"
                            theme="GithubDark"
                            value={JSON.stringify(
                                editSnippetForm.getValues().snippet || [],
                                null,
                                2
                            )}
                        />
                    </Paper>

                    <Paper
                        mb="md"
                        p="md"
                        radius="sm"
                        style={{
                            backgroundColor: editSnippetForm.getInputProps('snippet').error
                                ? 'rgba(241, 65, 65, 0.1)'
                                : 'rgba(51, 171, 132, 0.1)',
                            border: `1px solid ${editSnippetForm.getInputProps('snippet').error ? 'rgb(241, 65, 65)' : 'rgb(51, 171, 132)'}`
                        }}
                    >
                        <Code
                            color={editSnippetForm.getInputProps('snippet').error ? 'red' : 'teal'}
                            style={{
                                backgroundColor: 'transparent',
                                fontSize: '0.9rem',
                                padding: 0
                            }}
                        >
                            {editSnippetForm.getInputProps('snippet').error ||
                                t('snippets.drawer.widget.snippet-is-valid')}
                        </Code>
                    </Paper>

                    <Group gap="sm" justify="flex-end">
                        <Button
                            disabled={isUpdating}
                            onClick={() => {
                                editSnippetForm.reset()
                                closeEditModal()
                            }}
                            variant="subtle"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button loading={isUpdating} type="submit">
                            {t('common.save')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )

    return (
        <>
            <Paper p={0} shadow="sm" withBorder>
                <Stack gap={0}>
                    <Group
                        gap="sm"
                        justify="space-between"
                        p="md"
                        style={{
                            borderBottom: '1px solid var(--mantine-color-dark-4)'
                        }}
                        wrap="nowrap"
                    >
                        <Group gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                            <TbCode color="var(--mantine-color-blue-5)" size={20} />
                            <Text fw={600} size="lg">
                                {t('snippets.drawer.widget.snippets')}
                            </Text>
                            <Badge radius="sm" size="md" variant="default">
                                {snippets?.snippets.length || 0}
                            </Badge>
                        </Group>
                        <ActionIcon
                            color="gray"
                            onClick={openSnippetsHelpModal}
                            size="sm"
                            variant="subtle"
                        >
                            <HiQuestionMarkCircle size={20} />
                        </ActionIcon>
                        <ActionIcon
                            color="gray"
                            onClick={() => {
                                queryClient.refetchQueries({
                                    queryKey: QueryKeys.snippets.getSnippets.queryKey
                                })
                            }}
                            size="sm"
                            variant="subtle"
                        >
                            <TbRefresh size={18} />
                        </ActionIcon>
                        <ActionIcon color="gray" onClick={close} size="sm" variant="subtle">
                            <TbX size={18} />
                        </ActionIcon>
                    </Group>

                    <Stack gap="md" p="md" style={{ flex: 1, overflow: 'hidden' }}>
                        <Button
                            fullWidth
                            leftSection={<TbPlus size={18} />}
                            onClick={handleOpenCreate}
                            variant="default"
                        >
                            {t('snippets.drawer.widget.new-snippet')}
                        </Button>

                        <ScrollArea h={!isMobile ? '700px' : '100%'}>
                            {isLoading && returnLoading()}
                            {!isLoading && renderSnippets()}
                        </ScrollArea>
                    </Stack>
                </Stack>
            </Paper>

            {renderCreateModal()}
            {renderEditModal()}
        </>
    )
}
