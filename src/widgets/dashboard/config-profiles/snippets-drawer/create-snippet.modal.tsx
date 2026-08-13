import type { editor } from 'monaco-editor'

import { MonacoSetupSnippetsFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Code, Group, Paper, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { Editor, Monaco, useMonaco } from '@monaco-editor/react'
import { CreateSnippetCommand } from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useCreateSnippet } from '@shared/api/hooks/snippets/snippets.mutation.hooks'
import { monacoTheme } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './SnippetsDrawer.module.css'

export const CREATE_SNIPPET_MODAL_ID = 'create-snippet-modal'

export const CreateSnippetModal = () => {
    const { t, i18n } = useTranslation()

    const monaco = useMonaco()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const createSnippetForm = useForm<CreateSnippetCommand.RequestBody>({
        name: 'create-snippet-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: schemaResolver(CreateSnippetCommand.RequestBodySchema),
        initialValues: {
            name: '',
            snippet: []
        }
    })

    useEffect(() => {
        if (!monaco) return

        MonacoSetupSnippetsFeature.setup(monaco, i18n.language)
    }, [i18n.language, monaco])

    const { mutate: createSnippet, isPending: isCreating } = useCreateSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })

                modals.close(CREATE_SNIPPET_MODAL_ID)
            }
        }
    })

    const handleCreate = (values: CreateSnippetCommand.RequestBody) => {
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

    const handleEditorDidMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
    }

    return (
        <form onSubmit={(e) => createSnippetForm.onSubmit(handleCreate)(e)}>
            <Box className={clsx(classes.container, isFullscreen && fullscreenClasses.overlay)}>
                {!isFullscreen && (
                    <TextInput
                        key={createSnippetForm.key('name')}
                        label={t('snippets.drawer.widget.snippet-name')}
                        placeholder={t(
                            'snippets.drawer.widget.enter-snippet-name-cannot-be-changed-later'
                        )}
                        required
                        {...createSnippetForm.getInputProps('name')}
                    />
                )}

                <Paper
                    className={clsx(classes.editorWrapper, isFullscreen && fullscreenClasses.fill)}
                    p={0}
                    pos="relative"
                    style={{
                        border: createSnippetForm.getInputProps('snippet').error
                            ? '1px solid var(--mantine-color-red-5)'
                            : '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <FullscreenToggleButton
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                    />

                    <Editor
                        beforeMount={handleEditorDidMount}
                        className={classes.editor}
                        defaultLanguage="json"
                        loading={t('config-editor.widget.loading-editor')}
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
                        onMount={(editor) => {
                            editorRef.current = editor

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
                            scrollbar: {
                                useShadows: false,
                                verticalHasArrows: true,
                                horizontalHasArrows: true,
                                vertical: 'visible',
                                horizontal: 'visible',
                                arrowSize: 30,
                                alwaysConsumeMouseWheel: false
                            },
                            detectIndentation: true,
                            folding: true,
                            foldingStrategy: 'indentation',
                            fontSize: 14,
                            formatOnPaste: true,
                            formatOnType: true,
                            guides: {
                                bracketPairs: true,
                                indentation: true
                            },
                            hover: { above: false },
                            insertSpaces: true,
                            minimap: { enabled: true },
                            quickSuggestions: true,
                            renderLineHighlight: 'all',
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            tabSize: 2,
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        }}
                        path="snippet://*"
                        theme="GithubDark"
                        value={JSON.stringify(createSnippetForm.getValues().snippet || [], null, 2)}
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
                        color={createSnippetForm.getInputProps('snippet').error ? 'red' : 'teal'}
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
                            modals.close(CREATE_SNIPPET_MODAL_ID)
                        }}
                        variant="subtle"
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button loading={isCreating} type="submit">
                        {t('common.create')}
                    </Button>
                </Group>
            </Box>
        </form>
    )
}
