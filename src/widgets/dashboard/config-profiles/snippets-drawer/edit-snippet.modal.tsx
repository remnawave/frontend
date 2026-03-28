import type { editor } from 'monaco-editor'

import { UpdateSnippetCommand } from '@remnawave/backend-contract'
import { Button, Code, Group, Paper, Stack } from '@mantine/core'
import { Editor, Monaco, useMonaco } from '@monaco-editor/react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { t } from 'i18next'

import { MonacoSetupSnippetsFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { monacoTheme } from '@shared/constants/monaco-theme'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useUpdateSnippet } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import classes from './SnippetsDrawer.module.css'

export const EDIT_SNIPPET_MODAL_ID = 'edit-snippet-modal'

interface IProps {
    snippet: UpdateSnippetCommand.Response['response']['snippets'][number]
}

export const EditSnippetModal = (props: IProps) => {
    const { snippet } = props

    const { i18n } = useTranslation()

    const monaco = useMonaco()
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const { mutate: updateSnippet, isPending: isUpdating } = useUpdateSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
                modals.close(EDIT_SNIPPET_MODAL_ID)
            }
        }
    })

    const editSnippetForm = useForm<UpdateSnippetCommand.Request>({
        name: 'edit-snippet-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: zodResolver(UpdateSnippetCommand.RequestSchema),
        initialValues: {
            name: snippet.name,
            snippet: snippet.snippet as unknown as UpdateSnippetCommand.Request['snippet']
        }
    })

    const handleEditorDidMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
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

    useEffect(() => {
        if (!monaco) return

        MonacoSetupSnippetsFeature.setup(monaco, i18n.language)
    }, [i18n.language, monaco])

    return (
        <form onSubmit={(e) => editSnippetForm.onSubmit(handleUpdate)(e)}>
            <Stack gap="md">
                <CopyableFieldShared
                    label={t('snippets.drawer.widget.snippet-name')}
                    value={editSnippetForm.getValues().name}
                />

                <Paper
                    p={0}
                    style={{
                        border: editSnippetForm.getInputProps('snippet').error
                            ? '1px solid var(--mantine-color-red-5)'
                            : '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <Editor
                        beforeMount={handleEditorDidMount}
                        className={classes.editor}
                        defaultLanguage="json"
                        height={400}
                        loading={t('config-editor.widget.loading-editor')}
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
                        onMount={(editor) => {
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
                        value={JSON.stringify(editSnippetForm.getValues().snippet || [], null, 2)}
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
                            modals.close(EDIT_SNIPPET_MODAL_ID)
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
    )
}
