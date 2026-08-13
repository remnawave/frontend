import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { MonacoSetupHostMapperEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Code, Group, Modal, Paper } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { Editor, Monaco, useMonaco } from '@monaco-editor/react'
import {
    CreateHostCommand,
    HostMapperSchema,
    UpdateHostCommand,
    UpdateManyHostsCommand
} from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowsExchange } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { monacoTheme } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './HostMapperModal.module.css'

const EMPTY_MAPPER = JSON.stringify({ xrayJson: [], mihomo: [], base64: [] }, null, 2)

interface IProps {
    form: UseFormReturnType<
        | CreateHostCommand.RequestBody
        | UpdateHostCommand.RequestBody
        | UpdateManyHostsCommand.RequestBody
    >
    rawInbound?: unknown
}

export const HostMapperModal = NiceModal.create((props: IProps) => {
    const { form, rawInbound } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const monaco = useMonaco()
    const monacoRef = useRef<Monaco | null>(null)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const [error, setError] = useState<null | string>(null)

    const currentMapper = form.getValues().mapper

    const initialValue =
        currentMapper && Object.keys(currentMapper).length > 0
            ? JSON.stringify(currentMapper, null, 2)
            : EMPTY_MAPPER

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
    }

    useEffect(() => {
        if (!monaco) return

        MonacoSetupHostMapperEditorFeature.setup(monaco, rawInbound)
    }, [monaco, rawInbound])

    const handleSave = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue().trim()

        if (currentValue === '') {
            form.setFieldValue('mapper', undefined)
            hide()
            return
        }

        let parsed: unknown

        try {
            parsed = JSON.parse(currentValue)
        } catch {
            setError(t('base-host-form.invalid-json'))
            return
        }

        const result = HostMapperSchema.safeParse(parsed)

        if (!result.success) {
            const issue = result.error.issues[0]
            setError(`${issue.path.join('.') || 'mapper'}: ${issue.message}`)
            return
        }

        form.setFieldValue('mapper', result.data)
        hide()
    }

    return (
        <Modal
            {...modalProps}
            classNames={{ header: classes.header }}
            size="90%"
            transitionProps={{ transition: 'fade', duration: 200 }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbArrowsExchange}
                    iconVariant="soft"
                    title={t('base-host-form.mapper')}
                />
            }
        >
            <Box className={clsx(classes.container, isFullscreen && fullscreenClasses.overlay)}>
                <Paper
                    className={clsx(classes.editorWrapper, isFullscreen && fullscreenClasses.fill)}
                    p={0}
                    pos="relative"
                    style={{
                        border: error
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
                        beforeMount={handleEditorWillMount}
                        className={classes.monacoEditor}
                        defaultLanguage="json"
                        value={initialValue}
                        loading={t('config-editor.widget.loading-editor')}
                        onChange={() => setError(null)}
                        onMount={(editor, monaco) => {
                            editorRef.current = editor
                            monacoRef.current = monaco

                            forceMonacoRetokenize(editor)

                            const contribution = editor.getContribution(
                                'editor.contrib.suggestController'
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            ) as any

                            if (contribution && contribution.widget) {
                                const suggestWidget = contribution.widget.value
                                if (suggestWidget?._setDetailsVisible) {
                                    suggestWidget._setDetailsVisible(true)
                                }
                                if (suggestWidget?._persistedSize) {
                                    suggestWidget._persistedSize.store({
                                        width: 300,
                                        height: 300
                                    })
                                }
                            }
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
                        path="host-mapper://*"
                        theme="GithubDark"
                    />
                </Paper>

                {error && (
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
                            {error}
                        </Code>
                    </Paper>
                )}

                <Group gap="sm" justify="flex-end">
                    <Button onClick={hide} variant="subtle">
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSave}>{t('common.save')}</Button>
                </Group>
            </Box>
        </Modal>
    )
})
