import type { editor } from 'monaco-editor'

import { MonacoSetupSnippetsFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Group, Paper } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { useMonaco } from '@monaco-editor/react'
import { UpdateSnippetCommand } from '@remnawave/backend-contract'
import clsx from 'clsx'
import { t } from 'i18next'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@shared/api'
import { useSyncSnippet, useUpdateSnippet } from '@shared/api/hooks'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useModalEscapeGuard, usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import { openConfirmSnippetSyncModal } from './confirm-snippet-sync.modal'
import classes from './Snippets.module.css'

export const EDIT_SNIPPET_MODAL_ID = 'edit-snippet-modal'

interface IProps {
    snippet: UpdateSnippetCommand.Response['response']['snippets'][number]
}

export const EditSnippetModal = (props: IProps) => {
    const { snippet } = props

    const { i18n } = useTranslation()

    const monaco = useMonaco()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    useModalEscapeGuard(EDIT_SNIPPET_MODAL_ID, isFullscreen)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const { mutate: updateSnippet, isPending: isUpdating } = useUpdateSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
                modals.close(EDIT_SNIPPET_MODAL_ID)
            }
        }
    })

    const { mutate: syncSnippet } = useSyncSnippet()

    const editSnippetForm = useForm<UpdateSnippetCommand.RequestBody>({
        name: 'edit-snippet-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: schemaResolver(UpdateSnippetCommand.RequestBodySchema),
        initialValues: {
            name: snippet.name,
            snippet: snippet.snippet as unknown as UpdateSnippetCommand.RequestBody['snippet']
        }
    })

    const handleUpdate = (values: UpdateSnippetCommand.RequestBody) => {
        if (!editorRef.current) return

        let currentValue = editorRef.current.getValue()

        try {
            currentValue = JSON.parse(currentValue)
        } catch {
            editSnippetForm.setFieldError('snippet', t('common.message.invalid-json'))
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

        updateSnippet(
            {
                variables: {
                    name: values.name,
                    snippet: currentValue
                }
            },
            {
                onSuccess: () => {
                    openConfirmSnippetSyncModal(() => {
                        syncSnippet({
                            variables: {
                                name: values.name
                            }
                        })
                    })
                }
            }
        )
    }

    useEffect(() => {
        if (!monaco) return

        MonacoSetupSnippetsFeature.setup(i18n.language)
    }, [i18n.language, monaco])

    const hasSnippetError = Boolean(editSnippetForm.getInputProps('snippet').error)

    return (
        <form onSubmit={(e) => editSnippetForm.onSubmit(handleUpdate)(e)}>
            <Box className={clsx(classes.container, isFullscreen && fullscreenClasses.overlay)}>
                {!isFullscreen && (
                    <CopyableFieldShared
                        label={t('snippets.drawer.widget.snippet-name')}
                        value={editSnippetForm.getValues().name}
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
                                    {(editSnippetForm.getInputProps('snippet').error as string) ||
                                        t('snippets.drawer.widget.snippet-is-valid')}
                                </EditorStatusBar>
                            }
                            className={classes.editor}
                            defaultLanguage="json"
                            onChange={(value) => {
                                try {
                                    JSON.parse(value || '[]')

                                    editSnippetForm.clearErrors()
                                } catch {
                                    editSnippetForm.setFieldError(
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
                                editSnippetForm.getValues().snippet || [],
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
                            <Button loading={isUpdating} type="submit" variant="soft">
                                {t('common.action.save')}
                            </Button>
                            <Button
                                disabled={isUpdating}
                                onClick={() => {
                                    editSnippetForm.reset()
                                    modals.close(EDIT_SNIPPET_MODAL_ID)
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
