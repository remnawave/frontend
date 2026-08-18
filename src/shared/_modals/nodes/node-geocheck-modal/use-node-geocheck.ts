import { GeocheckByNodeCommand, GeocheckByNodeResultCommand } from '@remnawave/backend-contract'
import { useCallback, useState } from 'react'

import { useGeocheckByNode, useGeocheckByNodeResult } from '@shared/api/hooks'

const POLL_INTERVAL = 1000

type TGeocheckResponse = GeocheckByNodeResultCommand.Response['response']

export type GeocheckResult = NonNullable<TGeocheckResponse['result']>

export const useNodeGeocheck = (nodeUuid: string) => {
    const [jobId, setJobId] = useState<null | string>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [hasStartFailed, setHasStartFailed] = useState(false)

    const { mutate: geocheckByNode } = useGeocheckByNode({
        route: {
            nodeUuid
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            },
            onError: () => {
                setHasStartFailed(true)
            }
        }
    })

    const { data: geocheckResult } = useGeocheckByNodeResult({
        route: {
            jobId: jobId ?? ''
        },
        rQueryParams: {
            enabled: !!jobId,
            refetchInterval: (query) => {
                const data = query.state.data as TGeocheckResponse | undefined

                return data?.isCompleted || data?.isFailed ? false : POLL_INTERVAL
            }
        }
    })

    const start = useCallback(
        (variables: GeocheckByNodeCommand.RequestBody) => {
            setJobId(null)
            setHasStartFailed(false)
            setIsRunning(true)

            geocheckByNode({ variables })
        },
        [geocheckByNode]
    )

    const reset = useCallback(() => {
        setJobId(null)
        setHasStartFailed(false)
        setIsRunning(false)
    }, [])

    return {
        isCompleted: geocheckResult?.isCompleted ?? false,
        isFailed: hasStartFailed || (geocheckResult?.isFailed ?? false),
        isRunning,
        reset,
        result: geocheckResult?.result ?? null,
        start
    }
}
