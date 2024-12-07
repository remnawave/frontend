import { useEffect, useState } from 'react'
import { consola } from 'consola/browser'

import { fetchWithProgress } from '@shared/utils/fetch-with-progress'
import { useGetConfig } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { app } from 'src/config'

import { ConfigPageComponent } from '../components/config.page.component'

export function ConfigPageConnector() {
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const { data: { config } = { config: undefined }, isLoading: isConfigLoading } = useGetConfig()

    useEffect(() => {
        const initWasm = async () => {
            try {
                const go = new window.Go()
                const wasmInitialized = new Promise<void>((resolve) => {
                    window.onWasmInitialized = () => {
                        consola.info('WASM module initialized')
                        resolve()
                    }
                })

                const wasmBytes = await fetchWithProgress(
                    app.configEditor.wasmUrl,
                    setDownloadProgress
                )
                const { instance } = await WebAssembly.instantiate(wasmBytes, go.importObject)
                go.run(instance)
                await wasmInitialized

                if (typeof window.XrayParseConfig === 'function') {
                    setIsLoading(false)
                } else {
                    throw new Error('XrayParseConfig not initialized')
                }
            } catch (err: unknown) {
                consola.error('WASM initialization error:', err)
                setIsLoading(false)
            }
        }

        initWasm()
        return () => {
            delete window.onWasmInitialized
        }
    }, [])

    if (isLoading || isConfigLoading || !config) {
        return <LoadingScreen text={`WASM module is loading...`} value={downloadProgress} />
    }

    return <ConfigPageComponent config={config} />
}
