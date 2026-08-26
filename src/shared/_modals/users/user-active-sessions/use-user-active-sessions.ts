import { notifications } from '@mantine/notifications'
import { ConnectionsByUserResultCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    useDropConnections,
    useConnectionsByUser,
    useConnectionsByUserResult
} from '@shared/api/hooks'

export type ActiveSessionNode = NonNullable<
    ConnectionsByUserResultCommand.Response['response']['result']
>['nodes'][number]

export const useUserActiveSessions = (userId: number) => {
    const { t } = useTranslation()

    const [jobId, setJobId] = useState<null | string>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isFailed, setIsFailed] = useState(false)

    const { mutate: connectionsByUser } = useConnectionsByUser({
        route: {
            userId: userId
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            }
        }
    })

    const { mutate: dropConnections } = useDropConnections({
        mutationFns: {
            onSuccess: () => {
                notifications.show({
                    title: t('common.message.success'),
                    message: t('common.message.event-sent'),
                    color: 'teal'
                })
            }
        }
    })

    const shouldPoll = !!jobId && !isCompleted && !isFailed

    const { data: connectionsByUserResult } = useConnectionsByUserResult({
        route: { jobId: jobId ?? '' },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    useEffect(() => {
        if (!connectionsByUserResult) return undefined
        if (
            connectionsByUserResult.isFailed ||
            (connectionsByUserResult.isCompleted && !connectionsByUserResult.result?.success)
        ) {
            // oxlint-disable-next-line
            setIsFailed(true)
            return undefined
        }
        if (connectionsByUserResult.isCompleted) {
            const timer = setTimeout(() => setIsCompleted(true), 500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [connectionsByUserResult])

    const refresh = useCallback(() => {
        setJobId(null)
        setIsCompleted(false)
        setIsFailed(false)
        connectionsByUser({})
    }, [connectionsByUser])

    useEffect(() => {
        connectionsByUser({})
    }, [])

    const dropAll = useCallback(
        () =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'userIds',
                        userIds: [userId]
                    },
                    targetNodes: {
                        target: 'allNodes'
                    }
                }
            }),
        [dropConnections, userId]
    )

    const dropNode = useCallback(
        (nodeUuid: string) =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'userIds',
                        userIds: [userId]
                    },
                    targetNodes: {
                        target: 'specificNodes',
                        nodeUuids: [nodeUuid]
                    }
                }
            }),
        [dropConnections, userId]
    )

    const dropIp = useCallback(
        (ip: string, nodeUuid: string) =>
            dropConnections({
                variables: {
                    dropBy: {
                        by: 'ipAddresses',
                        ipAddresses: [ip]
                    },
                    targetNodes: {
                        target: 'specificNodes',
                        nodeUuids: [nodeUuid]
                    }
                }
            }),
        [dropConnections]
    )

    return {
        dropAll,
        dropIp,
        dropNode,
        isCompleted,
        isFailed,
        nodes: connectionsByUserResult?.result?.nodes,
        progress: connectionsByUserResult?.progress,
        refresh
    }
}
