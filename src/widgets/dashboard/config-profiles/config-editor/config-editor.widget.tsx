import { Box, Card, Code, Paper, Text } from '@mantine/core'
import Editor, { Monaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlocker } from 'react-router-dom'
import { modals } from '@mantine/modals'

import { ConfigEditorActionsFeature } from '@features/dashboard/config-profiles/config-editor-actions'
import { ConfigValidationFeature } from '@features/dashboard/config-profiles/config-validation'
import { MonacoSetupFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { monacoTheme } from '@shared/constants/monaco-theme/monaco-theme'

import styles from './ConfigEditor.module.css'
import { IProps } from './interfaces'

export function ConfigEditorWidget(props: IProps) {
    const { t, i18n } = useTranslation()

    const { configProfile } = props
    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState('')

    const editorRef = useRef<unknown>(null)
    const monacoRef = useRef<unknown>(null)

    useEffect(() => {
        const initialValue = JSON.stringify(configProfile.config, null, 2)
        setOriginalValue(initialValue)
        setHasUnsavedChanges(false)
    }, [configProfile.config])

    useEffect(() => {
        if (!monacoRef.current) return
        MonacoSetupFeature.setup(monacoRef.current as Monaco, i18n.language)
    }, [monacoRef.current, i18n.language])

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
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
    }

    const checkForChanges = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()
        const hasChanges = currentValue !== originalValue
        setHasUnsavedChanges(hasChanges)
    }

    return (
        <Box>
            {result && (
                <Paper
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
                        block
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
                mb="md"
                p={0}
                radius="xs"
                style={{
                    resize: 'vertical',
                    overflow: 'hidden',
                    height: '700px',
                    direction: 'ltr'
                }}
                withBorder
            >
                <Editor
                    beforeMount={handleEditorDidMount}
                    className={styles.monacoEditor}
                    defaultLanguage="json"
                    loading={t('config-editor.widget.loading-editor')}
                    onChange={() => {
                        ConfigValidationFeature.validate(
                            editorRef,
                            monacoRef,
                            setResult,
                            setIsConfigValid
                        )
                        checkForChanges()
                    }}
                    onMount={(editor, monaco) => {
                        editorRef.current = editor
                        monacoRef.current = monaco
                        ConfigValidationFeature.validate(
                            editorRef,
                            monacoRef,
                            setResult,
                            setIsConfigValid
                        )
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
                        lineNumbersMinChars: 1,
                        minimap: { enabled: true },
                        quickSuggestions: true,
                        renderLineHighlight: 'all',
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        tabSize: 2
                    }}
                    theme={'GithubDark'}
                    value={JSON.stringify(configProfile.config, null, 2)}
                />
            </Paper>

            <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                <ConfigEditorActionsFeature
                    configProfile={configProfile}
                    editorRef={editorRef}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isConfigValid={isConfigValid}
                    monacoRef={monacoRef}
                    originalValue={originalValue}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    setIsConfigValid={setIsConfigValid}
                    setOriginalValue={setOriginalValue}
                    setResult={setResult}
                />
            </Card>
        </Box>
    )
}
