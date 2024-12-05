import Editor, { Monaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { Box, Code, Paper } from '@mantine/core'

import { ConfigEditorActionsFeature } from '@features/dashboard/config/config-editor-actions'
import { ConfigValidationFeature } from '@features/dashboard/config/config-validation'
import { MonacoSetupFeature } from '@features/dashboard/config/monaco-setup'
import { monacoTheme } from '@shared/utils/monaco-theme/monaco-theme'

import { Props } from './interfaces'

export function ConfigEditorWidget(props: Props) {
    const { config } = props
    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const editorRef = useRef<unknown>(null)
    const monacoRef = useRef<unknown>(null)

    useEffect(() => {
        if (!monacoRef.current) return
        MonacoSetupFeature.setup(monacoRef.current as Monaco)
    }, [monacoRef.current])

    const handleEditorDidMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme
        })
    }

    return (
        <Box>
            <Paper mb="md" p={0} radius="xs" withBorder>
                <Editor
                    beforeMount={handleEditorDidMount}
                    defaultLanguage="json"
                    height="400px"
                    loading={'Loading editor...'}
                    onChange={() =>
                        ConfigValidationFeature.validate(
                            editorRef,
                            monacoRef,
                            setResult,
                            setIsConfigValid
                        )
                    }
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
                        bracketPairColorization: true,
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
                        minimap: { enabled: false },
                        quickSuggestions: true,
                        scrollBeyondLastLine: false,
                        tabSize: 2
                    }}
                    theme={'GithubDark'}
                    value={JSON.stringify(config, null, 2)}
                />
            </Paper>

            <ConfigEditorActionsFeature
                editorRef={editorRef}
                isConfigValid={isConfigValid}
                isSaving={isSaving}
                monacoRef={monacoRef}
                setIsSaving={setIsSaving}
                setResult={setResult}
            />

            {result && (
                <Code block p="md">
                    {result}
                </Code>
            )}
        </Box>
    )
}
