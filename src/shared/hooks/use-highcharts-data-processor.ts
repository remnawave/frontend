import { GetNodeUserUsageByRangeCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useRef, useState } from 'react'
import { endpointSymbol } from 'vite-plugin-comlink/symbol'
import consola from 'consola/browser'

import { HighchartsProcessedData } from '../workers/highcharts-data-processor.types'

interface UseHighchartsDataProcessorOptions {
    maxDisplayedUsers?: number
    minTrafficThreshold?: number
    selectedUsers?: string[]
}

type WorkerType = typeof import('../workers/highcharts-data-processor.worker.ts')

export function useHighchartsDataProcessor() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedData, setProcessedData] = useState<HighchartsProcessedData | null>(null)
    const [error, setError] = useState<null | string>(null)

    const workerRef = useRef<null | (WorkerType & { [endpointSymbol]: Worker })>(null)
    const pendingRequestRef = useRef<number>(0)
    const isCleanedUpRef = useRef(false)

    useEffect(() => {
        let shouldCleanup = false
        isCleanedUpRef.current = false

        const initWorker = async () => {
            try {
                if (!workerRef.current && !shouldCleanup) {
                    consola.log('🚀 Creating new worker...')

                    const worker = new ComlinkWorker<WorkerType>(
                        new URL('../workers/highcharts-data-processor.worker.ts', import.meta.url),
                        {
                            type: 'module'
                        }
                    )

                    if (!shouldCleanup) {
                        workerRef.current = worker
                        consola.log('✅ Worker created successfully')

                        const nativeWorker = worker[endpointSymbol] as unknown as Worker

                        nativeWorker.addEventListener('error', (error) => {
                            consola.error('❌ Worker error:', error)
                        })

                        nativeWorker.addEventListener('messageerror', (error) => {
                            consola.error('❌ Worker message error:', error)
                        })
                    }
                }
            } catch (error) {
                if (!shouldCleanup) {
                    consola.error('❌ Failed to create worker:', error)
                    setError(
                        `Failed to initialize worker: ${error instanceof Error ? error.message : 'Unknown error'}`
                    )
                }
            }
        }

        initWorker()

        return () => {
            shouldCleanup = true
            isCleanedUpRef.current = true

            if (workerRef.current) {
                consola.log('🧹 Cleaning up worker...')

                try {
                    const nativeWorker = workerRef.current[endpointSymbol] as unknown as Worker

                    if (nativeWorker) {
                        const checkTermination = () => {
                            consola.log('🏁 Worker terminated successfully')
                        }

                        nativeWorker.addEventListener?.('terminate', checkTermination)

                        nativeWorker.terminate()
                        consola.log('🔪 Worker.terminate() called')
                    }
                } catch (error) {
                    consola.error('❌ Error during worker cleanup:', error)
                } finally {
                    workerRef.current = null
                    consola.log('🗑️ Worker reference cleared')
                }
            }
        }
    }, [])

    const processData = useCallback(
        async (
            data: GetNodeUserUsageByRangeCommand.Response['response'],
            options: UseHighchartsDataProcessorOptions = {}
        ) => {
            if (!workerRef.current || !data || isCleanedUpRef.current) {
                consola.warn('⚠️ Worker not available or component unmounted')
                return
            }

            const currentRequest = ++pendingRequestRef.current
            consola.log(`📊 Starting data processing (request #${currentRequest})`)

            setIsProcessing(true)
            setError(null)

            try {
                const {
                    maxDisplayedUsers = 100,
                    minTrafficThreshold = 100 * 1024,
                    selectedUsers = []
                } = options

                const result = await workerRef.current.processData(data, {
                    maxDisplayedUsers,
                    minTrafficThreshold,
                    selectedUsers
                })

                if (currentRequest === pendingRequestRef.current && !isCleanedUpRef.current) {
                    consola.log(`✅ Data processing completed (request #${currentRequest})`)
                    setProcessedData(result)
                    setIsProcessing(false)
                    setError(null)
                } else {
                    consola.log(`🚫 Discarding stale result (request #${currentRequest})`)
                }
            } catch (error) {
                if (currentRequest === pendingRequestRef.current && !isCleanedUpRef.current) {
                    consola.error(`❌ Processing error (request #${currentRequest}):`, error)
                    setError(
                        `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
                    )
                    setIsProcessing(false)
                }
            }
        },
        []
    )

    const terminateWorker = useCallback(() => {
        if (workerRef.current) {
            consola.log('🔪 Force terminating worker...')
            const nativeWorker = workerRef.current[endpointSymbol] as unknown as Worker
            nativeWorker?.terminate()
            workerRef.current = null
            isCleanedUpRef.current = true
            consola.log('🏁 Worker force terminated')
        }
    }, [])

    return {
        error,
        isProcessing,
        processData,
        processedData,
        terminateWorker,
        isWorkerActive: !!workerRef.current && !isCleanedUpRef.current
    }
}
