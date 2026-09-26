import type { editor } from 'monaco-editor'

import { MonacoSetupSnippetsFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Group, Paper, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { useMonaco } from '@monaco-editor/react'
import { CreateSnippetCommand } from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useCreateSnippet } from '@shared/api/hooks/snippets/snippets.mutation.hooks'
import { useModalEscapeGuard, usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './Snippets.module.css'

export const CREATE_SNIPPET_MODAL_ID = 'create-snippet-modal'

export const CreateSnippetModal = () => {
    const { t, i18n } = useTranslation()

    const monaco = useMonaco()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    useModalEscapeGuard(CREATE_SNIPPET_MODAL_ID, isFullscreen)
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

        MonacoSetupSnippetsFeature.setup(i18n.language)
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
            createSnippetForm.setFieldError('snippet', t('common.message.invalid-json'))
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

    const hasSnippetError = Boolean(createSnippetForm.getInputProps('snippet').error)

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
                        style={{
                            border: hasSnippetError
                                ? '1px solid var(--mantine-color-red-5)'
                                : '1px solid var(--mantine-color-dark-4)'
                        }}
                        withBorder
                    >
                        <CodeEditor
                            footer={
                                <EditorStatusBar status={hasSnippetError ? 'error' : 'success'}>
                                    {(createSnippetForm.getInputProps('snippet').error as string) ||
                                        t('snippets.drawer.widget.snippet-is-valid')}
                                </EditorStatusBar>
                            }
                            className={classes.editor}
                            defaultLanguage="json"
                            onChange={(value) => {
                                try {
                                    JSON.parse(value || '[]')

                                    createSnippetForm.clearErrors()
                                } catch {
                                    createSnippetForm.setFieldError(
                                        'snippet',
                                        t('common.message.invalid-json')
                                    )
                                }
                            }}
                            onMount={(editor) => {
                                editorRef.current = editor

                                forceMonacoRetokenize(editor)
                            }}
                            options={{
                                hover: { above: false }
                            }}
                            path="snippet://*"
                            value={JSON.stringify(
                                createSnippetForm.getValues().snippet || [],
                                null,
                                2
                            )}
                        />
                    </Paper>

                    <EditorFooter className={clsx(hasSnippetError && classes.footerError)}>
                        <FullscreenToggleButton
                            floating={false}
                            isFullscreen={isFullscreen}
                            onToggle={toggleFullscreen}
                            size={36}
                        />

                        <Group>
                            <Button loading={isCreating} type="submit" variant="soft">
                                {t('common.action.create')}
                            </Button>
                            <Button
                                disabled={isCreating}
                                onClick={() => {
                                    createSnippetForm.reset()
                                    modals.close(CREATE_SNIPPET_MODAL_ID)
                                }}
                                variant="subtle"
                            >
                                {t('common.action.cancel')}
                            </Button>
                        </Group>
                    </EditorFooter>
                </div>
            </Box>
        </form>
    )
}
