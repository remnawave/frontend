import {
    useConfigStoreActions,
    useConfigStoreConfig,
    useConfigStoreIsConfigLoading
} from '@entities/dashboard/config/config-store/config-store'
import { useEffect, useState } from 'react'
import { consola } from 'consola/browser'

import { fetchWithProgress } from '@shared/utils/fetch-with-progress'
import { LoadingScreen } from '@shared/ui'
import { app } from 'src/config'

import { ConfigPageComponent } from '../components/config.page.component'

export function ConfigPageConnector() {
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const config = useConfigStoreConfig()
    const actions = useConfigStoreActions()
    const isConfigLoading = useConfigStoreIsConfigLoading()

    useEffect(() => {
        actions.getConfig()
    }, [])

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
