import type { editor } from 'monaco-editor'

import { GetAllHostsCommand, GetSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import Editor, { Monaco } from '@monaco-editor/react'
import 'monaco-yaml/yaml.worker.js'
import { Box, Card, Paper } from '@mantine/core'
import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { TemplateEditorActionsFeature } from '@features/dashboard/subscription-templates/template-editor-actions'
import { monacoTheme } from '@shared/constants/monaco-theme/monaco-theme'
import { preventBackScroll } from '@shared/utils/misc'

import { configureMonaco } from './utils/setup-template-monaco'
import styles from './SubscriptionTemplateEditor.module.css'

interface Props {
    editorType: 'json' | 'yaml'
    hosts: GetAllHostsCommand.Response['response']
    template: GetSubscriptionTemplateCommand.Response['response']
}

export function SubscriptionTemplateEditorWidget(props: Props) {
    const { t } = useTranslation()
    const { editorType, hosts, template } = props

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)

    const getConfig = () => {
        if (editorType === 'yaml') {
            return template.encodedTemplateYaml
                ? Buffer.from(template.encodedTemplateYaml, 'base64').toString()
                : ''
        }
        return JSON.stringify(template.templateJson, null, 2)
    }

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
        configureMonaco(monaco, editorType, hosts)
    }

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
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

            if (suggestWidget && suggestWidget._persistedSize) {
                suggestWidget._persistedSize.store({ width: 400, height: 256 })
            }
        }
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
            <Paper
                className={styles.editorWrapper}
                p={0}
                style={{
                    direction: 'ltr'
                }}
                withBorder
            >
                <Editor
                    beforeMount={handleEditorWillMount}
                    className={styles.monacoEditor}
                    defaultLanguage={editorType}
                    loading={t('config-editor.widget.loading-editor')}
                    onMount={handleEditorDidMount}
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
                        scrollbar: {
                            useShadows: false,
                            verticalHasArrows: true,
                            horizontalHasArrows: true,
                            vertical: 'visible',
                            horizontal: 'visible',
                            arrowSize: 30,
                            alwaysConsumeMouseWheel: false
                        },
                        smoothScrolling: true,
                        insertSpaces: true,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        renderValidationDecorations: 'on',
                        quickSuggestions: {
                            strings: true,
                            comments: true,
                            other: true
                        },
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    }}
                    theme="GithubDark"
                    value={getConfig() || ''}
                />
            </Paper>

            <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                <TemplateEditorActionsFeature
                    editorRef={editorRef}
                    editorType={editorType}
                    template={template}
                />
            </Card>
        </Box>
    )
}
