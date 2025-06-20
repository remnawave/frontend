import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { consola } from 'consola/browser'

import { useGetConfigProfile, useGetConfigProfiles } from '@shared/api/hooks'
import { fetchWithProgress } from '@shared/utils/fetch-with-progress'
import { ROUTES } from '@shared/constants'
import { LoadingScreen } from '@shared/ui'
import { app } from 'src/config'

import { ConfigProfileByUuidPageComponent } from '../components/config-profile-by-uuid.page.component'

export function ConfigProfileByUuidPageConnector() {
    const { uuid } = useParams()

    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const { data: configProfile, isLoading: isConfigProfileLoading } = useGetConfigProfile({
        route: { uuid: uuid! },
        rQueryParams: {
            enabled: !!uuid
        }
    })

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

    if (!uuid) {
        return <Navigate to={ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES} />
    }

    if (isLoading || isConfigProfileLoading || !configProfile) {
        return <LoadingScreen text={`WASM module is loading...`} value={downloadProgress} />
    }

    return <ConfigProfileByUuidPageComponent configProfile={configProfile} />
}
