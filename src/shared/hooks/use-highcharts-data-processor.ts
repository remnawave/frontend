import { GetNodeUserUsageByRangeCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useRef, useState } from 'react'

interface HighchartsSeriesData {
    color: string
    data: number[]
    name: string
    total: number
}

interface HighchartsProcessedData {
    allAvailableUsers: Array<{ name: string; total: number }>
    categories: string[]
    displayedUserCount: number
    series: HighchartsSeriesData[]
    significantUserCount: number
    topUsers: string[]
    totalUsage: number
    trendData: { date: string; value: number }[]
    userCount: number
}

interface UseHighchartsDataProcessorOptions {
    maxDisplayedUsers?: number
    minTrafficThreshold?: number
    selectedUsers?: string[]
}

export function useHighchartsDataProcessor() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [processedData, setProcessedData] = useState<HighchartsProcessedData | null>(null)
    const [error, setError] = useState<null | string>(null)

    const workerRef = useRef<null | Worker>(null)
    const pendingRequestRef = useRef<number>(0)

    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(
                new URL('../workers/highcharts-data-processor.worker.ts', import.meta.url),
                { type: 'module' }
            )

            workerRef.current.onmessage = (e) => {
                const currentRequest = pendingRequestRef.current

                if (e.data.type === 'HIGHCHARTS_DATA_PROCESSED') {
                    if (currentRequest === pendingRequestRef.current) {
                        setProcessedData(e.data.result)
                        setIsProcessing(false)
                        setError(null)
                    }
                } else if (e.data.type === 'ERROR') {
                    setError(e.data.error)
                    setIsProcessing(false)
                }
            }

            workerRef.current.onerror = (error) => {
                setError(`Worker error: ${error.message}`)
                setIsProcessing(false)
            }
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate()
                workerRef.current = null
            }
        }
    }, [])

    const processData = useCallback(
        (
            data: GetNodeUserUsageByRangeCommand.Response['response'],
            options: UseHighchartsDataProcessorOptions = {}
        ) => {
            if (!workerRef.current || !data) {
                return
            }

            pendingRequestRef.current += 1

            setIsProcessing(true)
            setError(null)

            const {
                maxDisplayedUsers = 100,
                minTrafficThreshold = 100 * 1024,
                selectedUsers = []
            } = options

            workerRef.current.postMessage({
                data,
                payload: {
                    maxDisplayedUsers,
                    minTrafficThreshold,
                    selectedUsers
                },
                type: 'PROCESS_HIGHCHARTS_DATA'
            })
        },
        []
    )

    return {
        error,
        isProcessing,
        processData,
        processedData
    }
}
