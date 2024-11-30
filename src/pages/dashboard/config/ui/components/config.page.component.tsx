import { useEffect, useRef, useState } from 'react'

import { Box, Button, Code, Group, Paper } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    useConfigStoreActions,
    useConfigStoreConfig,
    useConfigStoreIsConfigLoading
} from '@entitites/dashboard/config/config-store/config-store'
import Editor, { Monaco } from '@monaco-editor/react'
import { Page } from '@shared/ui/page'
import axios from 'axios'
import dayjs from 'dayjs'
import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { LoadingScreen, PageHeader } from '@/shared/ui'
import { monacoTheme } from '@/shared/utils/monaco-theme/monaco-theme'
import { BREADCRUMBS } from './constant'

export const ConfigPageComponent = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const config = useConfigStoreConfig()
    const actions = useConfigStoreActions()
    const isConfigLoading = useConfigStoreIsConfigLoading()
    const [downloadProgress, setDownloadProgress] = useState(0)

    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)

    useEffect(() => {
        actions.getConfig()
    }, [])

    useEffect(() => {
        const setupMonaco = async () => {
            if (!monacoRef.current) return

            try {
                const response = await axios.get('/xray.schema.json')
                const schema = await response.data

                monacoRef.current.languages.json.jsonDefaults.setDiagnosticsOptions({
                    validate: true,
                    allowComments: false,
                    schemas: [
                        {
                            uri: 'https://xray-config-schema.json',
                            fileMatch: ['*'],
                            schema
                        }
                    ],
                    enableSchemaRequest: true,
                    schemaRequest: 'warning'
                })
            } catch (error) {
                console.error('Failed to load JSON schema:', error)
            }
        }

        setupMonaco()
    }, [monacoRef.current])

    useEffect(() => {
        const initWasm = async () => {
            try {
                const go = new window.Go()

                const wasmInitialized = new Promise<void>((resolve) => {
                    window.onWasmInitialized = () => {
                        console.log('WASM module initialized')
                        resolve()
                    }
                })

                const wasmBytes = await fetchWithProgress('/main.wasm')

                const { instance } = await WebAssembly.instantiate(wasmBytes, go.importObject)

                go.run(instance)

                await wasmInitialized

                if (typeof window.XrayParseConfig === 'function') {
                    setIsLoading(false)
                } else {
                    throw new Error('XrayParseConfig not initialized')
                }
            } catch (err: unknown) {
                setResult(`Editor error: ${(err as Error).message}`)
                setIsLoading(false)
            }
        }

        initWasm()

        return () => {
            delete window.onWasmInitialized
        }
    }, [])

    const fetchWithProgress = async (url: string) => {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        setDownloadProgress(progress)
                    } else {
                        setDownloadProgress(100)
                    }
                }
            })

            return response.data
        } catch (error) {
            console.error('Download failed:', error)
            throw error
        }
    }

    const handleSave = () => {
        const currentValue = editorRef.current?.getValue()
        if (currentValue) {
            setIsSaving(true)

            try {
                actions.updateConfig(JSON.parse(currentValue))

                notifications.show({
                    title: 'Success',
                    message: 'Config updated successfully. All nodes will be restarted.',
                    color: 'green'
                })
            } catch (err) {
                setResult(`Error: ${(err as Error).message}`)

                notifications.show({
                    title: 'Error',
                    message: `Error: ${(err as Error).message}`,
                    color: 'red'
                })
            } finally {
                setTimeout(() => {
                    setIsSaving(false)
                }, 300)
            }
        }
    }

    const formatDocument = () => {
        editorRef.current.getAction('editor.action.formatDocument').run()
    }

    const handleValidate = () => {
        try {
            const currentValue = editorRef.current?.getValue()
            const validationResult = window.XrayParseConfig(currentValue)

            setResult(
                `${dayjs().format('HH:mm:ss')} | ${validationResult || 'Xray config is valid.'}`
            )
            setIsConfigValid(!validationResult)
        } catch (err: unknown) {
            setResult(`${dayjs().format('HH:mm:ss')} | Validation error: ${(err as Error).message}`)
            setIsConfigValid(false)
        }
    }

    const handleEditorDidMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('GithubDark', {
            ...monacoTheme
        })
    }

    if (isLoading || isConfigLoading || !config) {
        return <LoadingScreen value={downloadProgress} text={`WASM module is loading...`} />
    }

    return (
        <Page title="Config">
            <PageHeader title="Xray Config Editor" breadcrumbs={BREADCRUMBS} />

            <Box>
                <Paper withBorder p={0} mb="md" radius="xs">
                    <Editor
                        loading={'Loading editor...'}
                        height="400px"
                        defaultLanguage="json"
                        value={JSON.stringify(config, null, 2)}
                        theme={'GithubDark'}
                        onChange={handleValidate}
                        onValidate={handleValidate}
                        beforeMount={handleEditorDidMount}
                        onMount={(editor, monaco) => {
                            editorRef.current = editor
                            monacoRef.current = monaco
                            handleValidate()
                        }}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            formatOnPaste: true,
                            formatOnType: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            quickSuggestions: true,
                            folding: true,
                            foldingStrategy: 'indentation',
                            autoIndent: 'full',
                            autoClosingBrackets: 'always',
                            autoClosingQuotes: 'always',
                            tabSize: 2,
                            detectIndentation: true,

                            insertSpaces: true,
                            bracketPairColorization: true,
                            guides: {
                                bracketPairs: true,
                                indentation: true
                            }
                        }}
                    />
                </Paper>

                <Group>
                    <Button
                        onClick={formatDocument}
                        mb="md"
                        leftSection={<PiCheckSquareOffset size={16} />}
                    >
                        Format
                    </Button>
                    <Button
                        onClick={handleSave}
                        mb="md"
                        loading={isSaving}
                        leftSection={<PiFloppyDisk size={16} />}
                        disabled={!isConfigValid}
                    >
                        Save
                    </Button>
                </Group>

                {result && (
                    <Code block p="md">
                        {result}
                    </Code>
                )}
            </Box>
        </Page>
    )
}
