import type { editor } from 'monaco-editor'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import { Box, Card, Code, Paper, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useBlocker } from 'react-router-dom'
import { modals } from '@mantine/modals'

import { ConfigEditorActionsFeature } from '@features/dashboard/config-profiles/config-editor-actions'
import { ConfigValidationFeature } from '@features/dashboard/config-profiles/config-validation'
import { MonacoSetupFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { monacoTheme } from '@shared/constants/monaco-theme/monaco-theme'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './ConfigEditor.module.css'
import { IProps } from './interfaces'

export function ConfigEditorWidget(props: IProps) {
    const { t, i18n } = useTranslation()
    const monaco = useMonaco()

    const { configProfile, snippets } = props

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(true)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState<string>(
        JSON.stringify(configProfile.config, null, 2) || ''
    )

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        if (!monaco) return

        MonacoSetupFeature.setup(monaco, i18n.language, snippets.snippets)
    }, [i18n.language, snippets, monaco])

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    )

    const snippetMap = new Map(snippets.snippets.map((s) => [s.name, s.snippet]))

    const handleEditorDidMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
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

    return (
        <Box className={styles.container}>
            {result && (
                <Paper
                    className={styles.validationMessage}
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
                    loading={t('config-editor.widget.loading-editor')}
                    onChange={() => {
                        ConfigValidationFeature.validate(
                            editorRef,
                            setResult,
                            setIsConfigValid,
                            snippetMap
                        )
                        checkForChanges()
                    }}
                    onMount={(editor) => {
                        editorRef.current = editor

                        ConfigValidationFeature.validate(
                            editorRef,
                            setResult,
                            setIsConfigValid,
                            snippetMap
                        )
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
                    theme="GithubDark"
                    value={JSON.stringify(configProfile.config, null, 2)}
                />
            </Paper>

            <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                <ConfigEditorActionsFeature
                    configProfile={configProfile}
                    editorRef={editorRef}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isConfigValid={isConfigValid}
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
