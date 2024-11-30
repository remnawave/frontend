import axios from 'axios'
import dayjs from 'dayjs'
import { Page } from '@shared/ui/page'
import { useEffect, useRef, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { notifications } from '@mantine/notifications'
import { LoadingScreen, PageHeader } from '@/shared/ui'
import { Box, Button, Code, Group, Paper } from '@mantine/core'
import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { monacoTheme } from '@/shared/utils/monaco-theme/monaco-theme'
import {
    useConfigStoreActions,
    useConfigStoreConfig,
    useConfigStoreIsConfigLoading
} from '@entitites/dashboard/config/config-store/config-store'

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

    const editorRef = useRef<unknown>(null)
    const monacoRef = useRef<unknown>(null)

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
                    allowComments: false,
                    enableSchemaRequest: true,
                    schemaRequest: 'warning',
                    schemas: [
                        {
                            fileMatch: ['*'],
                            schema,
                            uri: 'https://xray-config-schema.json'
                        }
                    ],
                    validate: true
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

                // eslint-disable-next-line no-use-before-define
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
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        setDownloadProgress(progress)
                    } else {
                        setDownloadProgress(100)
                    }
                },
                responseType: 'arraybuffer'
            })

            return response.data
        } catch (error) {
            console.error('Download failed:', error)
            throw error
        }
    }

    const handleSave = () => {
        if (!editorRef.current) return
        if (!monacoRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (typeof monacoRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()
        if (currentValue) {
            setIsSaving(true)

            try {
                actions.updateConfig(JSON.parse(currentValue))

                notifications.show({
                    color: 'green',
                    message: 'Config updated successfully. All nodes will be restarted.',
                    title: 'Success'
                })
            } catch (err) {
                setResult(`Error: ${(err as Error).message}`)

                notifications.show({
                    color: 'red',
                    message: `Error: ${(err as Error).message}`,
                    title: 'Error'
                })
            } finally {
                setTimeout(() => {
                    setIsSaving(false)
                }, 300)
            }
        }
    }

    const formatDocument = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getAction' in editorRef.current)) return
        if (typeof editorRef.current.getAction !== 'function') return

        editorRef.current.getAction('editor.action.formatDocument').run()
    }

    const handleValidate = () => {
        try {
            if (!editorRef.current) return
            if (!monacoRef.current) return
            if (typeof editorRef.current !== 'object') return
            if (typeof monacoRef.current !== 'object') return
            if (!('getValue' in editorRef.current)) return
            if (typeof editorRef.current.getValue !== 'function') return

            const currentValue = editorRef.current.getValue()
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
        return <LoadingScreen text={`WASM module is loading...`} value={downloadProgress} />
    }

    return (
        <Page title="Config">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Xray Config Editor" />

            <Box>
                <Paper mb="md" p={0} radius="xs" withBorder>
                    <Editor
                        beforeMount={handleEditorDidMount}
                        defaultLanguage="json"
                        height="400px"
                        loading={'Loading editor...'}
                        onChange={handleValidate}
                        onMount={(editor, monaco) => {
                            editorRef.current = editor
                            monacoRef.current = monaco
                            handleValidate()
                        }}
                        onValidate={handleValidate}
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

                <Group>
                    <Button
                        leftSection={<PiCheckSquareOffset size={16} />}
                        mb="md"
                        onClick={formatDocument}
                    >
                        Format
                    </Button>
                    <Button
                        disabled={!isConfigValid}
                        leftSection={<PiFloppyDisk size={16} />}
                        loading={isSaving}
                        mb="md"
                        onClick={handleSave}
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
