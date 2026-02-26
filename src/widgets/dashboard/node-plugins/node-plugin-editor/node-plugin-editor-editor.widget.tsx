import type { editor } from 'monaco-editor'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GetNodePluginCommand } from '@remnawave/backend-contract'
import { Box, Card, Code, Paper, Text } from '@mantine/core'
import Editor, { Monaco } from '@monaco-editor/react'
import { useTranslation } from 'react-i18next'
import { useBlocker } from 'react-router-dom'
import { modals } from '@mantine/modals'

import { NodePluginsEditorActionsFeature } from '@features/dashboard/node-plugins/node-plugins-editor-actions'
import { MonacoSetupNodePluginEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './NodePluginEditor.module.css'

interface IProps {
    nodePlugin: GetNodePluginCommand.Response['response']['pluginConfig']
    pluginUuid: string
}

export function NodePluginEditorWidget(props: IProps) {
    const { t } = useTranslation()

    const { nodePlugin, pluginUuid } = props

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState('')

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)

    useEffect(() => {
        const initialValue = JSON.stringify(nodePlugin, null, 2)
        setOriginalValue(initialValue)
        setHasUnsavedChanges(false)
    }, [nodePlugin])

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    )

    useEffect(() => {
        if (blocker.state === 'blocked') {
            modals.openConfirmModal({
                title: t('config-editor.widget.unsaved-changes'),
                children: (
                    <Text c="dimmed" size="md">
                        {t(
                            'config-editor.widget.your-changes-will-be-lost-if-you-leave-this-page-without-saving'
                        )}
                    </Text>
                ),
                centered: true,
                labels: {
                    confirm: t('config-editor.widget.leave'),
                    cancel: t('config-editor.widget.stay')
                },

                confirmProps: {
                    color: 'red',
                    variant: 'light'
                },
                cancelProps: {
                    variant: 'light'
                },
                onConfirm: () => {
                    blocker.proceed()
                },
                onCancel: () => {
                    blocker.reset()
                },
                closeOnConfirm: true,
                closeOnCancel: true
            })
        }
    }, [blocker])

    const handleEditorDidMount = (monaco: Monaco) => {
        MonacoSetupNodePluginEditorFeature.setup(monaco)
    }

    const checkForChanges = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue()
        const hasChanges = currentValue !== originalValue
        setHasUnsavedChanges(hasChanges)
    }

    useLayoutEffect(() => {
        document.body.addEventListener('wheel', preventBackScroll, {
            passive: false
        })
        return () => {
            document.body.removeEventListener('wheel', preventBackScroll)
        }
    }, [])

    return (
        <Box className={styles.container}>
            {result && (
                <Paper
                    className={styles.validationMessage}
                    mb="md"
                    p="md"
                    radius="sm"
                    style={{
                        backgroundColor: isConfigValid
                            ? 'rgba(51, 171, 132, 0.1)'
                            : 'rgba(241, 65, 65, 0.1)',
                        border: `1px solid ${isConfigValid ? 'rgb(51, 171, 132)' : 'rgb(241, 65, 65)'}`
                    }}
                >
                    <Code
                        color={isConfigValid ? 'teal' : 'red'}
                        style={{
                            backgroundColor: 'transparent',
                            fontSize: '0.9rem',
                            padding: 0
                        }}
                    >
                        {result}
                    </Code>
                </Paper>
            )}

            <Paper
                className={styles.editorWrapper}
                p={0}
                style={{
                    direction: 'ltr'
                }}
                withBorder
            >
                <Editor
                    beforeMount={handleEditorDidMount}
                    className={styles.monacoEditor}
                    defaultLanguage="json"
                    loading="Editor is loading..."
                    onChange={() => {
                        checkForChanges()
                    }}
                    onMount={(editor, monaco) => {
                        editorRef.current = editor
                        monacoRef.current = monaco

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
                                suggestWidget._persistedSize.store({ width: 300, height: 300 })
                            }
                        }
                    }}
                    options={{
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        autoIndent: 'full',
                        automaticLayout: true,
                        fixedOverflowWidgets: true,
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
                    path="node-plugin://*"
                    theme="GithubDark"
                    value={JSON.stringify(nodePlugin, null, 2)}
                />
            </Paper>

            <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                <NodePluginsEditorActionsFeature
                    editorRef={editorRef}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isNodePluginValid={isConfigValid}
                    monacoRef={monacoRef}
                    originalValue={originalValue}
                    pluginUuid={pluginUuid}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    setIsNodePluginValid={setIsConfigValid}
                    setOriginalValue={setOriginalValue}
                    setResult={setResult}
                />
            </Card>
        </Box>
    )
}
