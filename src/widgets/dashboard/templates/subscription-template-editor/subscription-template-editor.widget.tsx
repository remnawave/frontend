/* eslint-disable @typescript-eslint/no-explicit-any */
import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'
import Editor, { Monaco } from '@monaco-editor/react'
import { Box, Divider, Paper } from '@mantine/core'
import 'monaco-yaml/yaml.worker.js'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'

import { TemplateEditorActionsFeature } from '@features/dashboard/subscription-templates/template-editor-actions'
import { monacoTheme } from '@shared/constants/monaco-theme/monaco-theme'

import { XrayJsonTemplateDescriptionWidget } from './xray-json-template-description.widget'
import { configureMonaco } from './utils/setup-template-monaco'
import styles from './SubscriptionTemplateEditor.module.css'
import { Props } from './interfaces'

export function SubscriptionTemplateEditorWidget(props: Props) {
    const { t } = useTranslation()
    const { encodedTemplateYaml, templateType, language, templateJson } = props

    const editorRef = useRef<unknown>(null)
    const monacoRef = useRef<unknown>(null)

    const getConfig = () => {
        if (language === 'yaml') {
            return encodedTemplateYaml ? Buffer.from(encodedTemplateYaml, 'base64').toString() : ''
        }
        return JSON.stringify(templateJson, null, 2)
    }

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme,
            base: 'vs-dark'
        })
        configureMonaco(monaco, language)
    }

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco
    }

    return (
        <Box>
            {templateType === SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON && (
                <XrayJsonTemplateDescriptionWidget />
            )}
            <Divider mb="md" mt="md" size="md" />

            <TemplateEditorActionsFeature
                editorRef={editorRef}
                language={language}
                monacoRef={monacoRef}
                templateType={templateType}
            />

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
                    beforeMount={handleEditorWillMount}
                    className={styles.monacoEditor}
                    defaultLanguage={language}
                    loading={t('config-editor.widget.loading-editor')}
                    onMount={handleEditorDidMount}
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
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        renderValidationDecorations: 'on',
                        quickSuggestions: {
                            strings: true,
                            comments: true,
                            other: true
                        },
                        padding: {
                            top: 33
                        }
                    }}
                    theme={'GithubDark'}
                    value={getConfig() || ''}
                />
            </Paper>
        </Box>
    )
}
