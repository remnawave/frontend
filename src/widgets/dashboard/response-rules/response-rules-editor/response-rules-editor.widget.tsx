import type { editor } from 'monaco-editor'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Card, Code, Paper, Text } from '@mantine/core'
import Editor, { Monaco } from '@monaco-editor/react'
import { useTranslation } from 'react-i18next'
import { useBlocker } from 'react-router-dom'
import { modals } from '@mantine/modals'

import { ResponseRulesEditorActionsFeature } from '@features/dashboard/response-rules/response-rules-editor-actions'
import { MonacoSetupResponseRulesFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './ResponseRulesEditor.module.css'
import { IProps } from './interfaces'

export function ResponseRulesEditorWidget(props: IProps) {
    const { t } = useTranslation()

    const { responseRules, subscriptionSettingsUuid } = props

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState('')

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)

    useEffect(() => {
        const initialValue = JSON.stringify(responseRules, null, 2)
        setOriginalValue(initialValue)
        setHasUnsavedChanges(false)
    }, [responseRules])

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
        MonacoSetupResponseRulesFeature.setup(monaco)
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
                style={{
                    resize: 'vertical',
                    overflow: 'visible',
                    height: '700px',
                    direction: 'ltr',
                    position: 'relative',
                    zIndex: 1
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
                    path="response-rules://*"
                    theme="GithubDark"
                    value={JSON.stringify(responseRules, null, 2)}
                />
            </Paper>

            <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                <ResponseRulesEditorActionsFeature
                    editorRef={editorRef}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isResponseRulesValid={isConfigValid}
                    monacoRef={monacoRef}
                    originalValue={originalValue}
                    responseRules={responseRules}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                    setIsResponseRulesValid={setIsConfigValid}
                    setOriginalValue={setOriginalValue}
                    setResult={setResult}
                    subscriptionSettingsUuid={subscriptionSettingsUuid}
                />
            </Card>
        </Box>
    )
}
