import { FetchUsersIpsResultCommand, GetAllNodesCommand } from '@remnawave/backend-contract'
import { useEffect, useRef, useState } from 'react'

import { useFetchUsersIps, useFetchUsersIpsResultMutation } from '@shared/api/hooks'

type NodeType = GetAllNodesCommand.Response['response'][number]
type NodeIpEntry = NonNullable<
    FetchUsersIpsResultCommand.Response['response']['result']
>['users'][number]['ips'][number]

type PollResult = NonNullable<FetchUsersIpsResultCommand.Response['response']['result']>

export interface AggregatedUserNode {
    countryCode: string
    ips: NodeIpEntry[]
    nodeName: string
    nodeUuid: string
}

export interface AggregatedUser {
    nodes: AggregatedUserNode[]
    totalIps: number
    uniqueIps: number
    userId: string
}

export interface ExplorerStats {
    nodesFailed: number
    nodesScanned: number
    totalIps: number
    totalUsers: number
    uniqueIps: number
}

export interface ActiveNodeInfo {
    countryCode: string
    name: string
    uuid: string
}

export interface ExplorerProgress {
    activeNodes: ActiveNodeInfo[]
    completed: number
    failed: number
    total: number
}

export type ExplorerPhase = 'completed' | 'failed' | 'idle' | 'running'

const MAX_CONCURRENT = 5
const POLL_INTERVAL = 1000

function delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, ms)
        const onAbort = () => {
            clearTimeout(timer)
            reject(new DOMException('Aborted', 'AbortError'))
        }
        signal.addEventListener('abort', onAbort, { once: true })
    })
}

async function runWithConcurrency<T>(
    items: T[],
    fn: (item: T) => Promise<void>,
    maxConcurrent: number,
    signal: AbortSignal
): Promise<void> {
    const pool = new Set<Promise<void>>()

    for (const item of items) {
        if (signal.aborted) break

        const p = fn(item).then(() => {
            pool.delete(p)
        })
        pool.add(p)

        if (pool.size >= maxConcurrent) {
            await Promise.race(pool) // eslint-disable-line no-await-in-loop
        }
    }

    await Promise.all(pool)
}

function isAbortError(err: unknown): boolean {
    if (err instanceof DOMException && err.name === 'AbortError') return true
    if (err && typeof err === 'object' && 'code' in err) {
        return (err as { code: string }).code === 'ERR_CANCELED'
    }
    return false
}

interface NodeResult {
    countryCode: string
    nodeName: string
    nodeUuid: string
    users: Array<{ ips: NodeIpEntry[]; userId: string }>
}

function aggregateResults(results: NodeResult[]) {
    const userMap = new Map<string, AggregatedUser>()
    const globalIpSet = new Set<string>()
    let totalIpCount = 0

    for (const nr of results) {
        for (const u of nr.users) {
            let agg = userMap.get(u.userId)
            if (!agg) {
                agg = { userId: u.userId, totalIps: 0, uniqueIps: 0, nodes: [] }
                userMap.set(u.userId, agg)
            }
            agg.nodes.push({
                nodeUuid: nr.nodeUuid,
                nodeName: nr.nodeName,
                ips: u.ips,
                countryCode: nr.countryCode
            })
            agg.totalIps += u.ips.length
            totalIpCount += u.ips.length
            for (const ip of u.ips) {
                globalIpSet.add(ip.ip)
            }
        }
    }

    for (const agg of userMap.values()) {
        const s = new Set<string>()
        for (const n of agg.nodes) {
            for (const ip of n.ips) {
                s.add(ip.ip)
            }
        }
        agg.uniqueIps = s.size
    }

    const sorted = [...userMap.values()].sort((a, b) => b.uniqueIps - a.uniqueIps)

    return { sorted, totalIpCount, uniqueIpCount: globalIpSet.size }
}

export function useSessionsExplorer(nodes: NodeType[] | undefined) {
    const [phase, setPhase] = useState<ExplorerPhase>('idle')
    const [progress, setProgress] = useState<ExplorerProgress>({
        completed: 0,
        failed: 0,
        total: 0,
        activeNodes: []
    })
    const [aggregatedUsers, setAggregatedUsers] = useState<AggregatedUser[]>([])
    const [stats, setStats] = useState<ExplorerStats | null>(null)

    const { mutateAsync: createNodeJob } = useFetchUsersIps()
    const { mutateAsync: fetchUsersIpsResult } = useFetchUsersIpsResultMutation()

    const abortRef = useRef<AbortController | null>(null)
    const nodesRef = useRef(nodes)

    useEffect(() => {
        nodesRef.current = nodes
    }, [nodes])

    useEffect(() => {
        return () => {
            abortRef.current?.abort()
        }
    }, [])

    const onlineNodes = nodes?.filter((n) => n.isConnected && !n.isDisabled) ?? []

    const start = async () => {
        const targetNodes = nodesRef.current?.filter((n) => n.isConnected && !n.isDisabled) ?? []
        if (targetNodes.length === 0) return

        abortRef.current?.abort()
        const ac = new AbortController()
        abortRef.current = ac
        const { signal } = ac

        const total = targetNodes.length
        setPhase('running')
        setProgress({ completed: 0, failed: 0, total, activeNodes: [] })
        setAggregatedUsers([])
        setStats(null)

        const results: NodeResult[] = []
        let completed = 0
        let failed = 0
        const activeNodesMap = new Map<string, ActiveNodeInfo>()

        const syncProgress = () => {
            setProgress({
                completed,
                failed,
                total,
                activeNodes: [...activeNodesMap.values()]
            })
        }

        const pollUntilDone = async (jobId: string): Promise<null | PollResult> => {
            await delay(POLL_INTERVAL, signal)
            const resp = await fetchUsersIpsResult({ route: { jobId }, query: { signal } })

            if (resp.isFailed || (resp.isCompleted && !resp.result?.success)) {
                return null
            }

            if (resp.isCompleted && resp.result) {
                return resp.result
            }

            if (signal.aborted) return null
            return pollUntilDone(jobId)
        }

        const processNode = async (node: NodeType) => {
            activeNodesMap.set(node.uuid, {
                name: node.name,
                countryCode: node.countryCode,
                uuid: node.uuid
            })
            syncProgress()

            try {
                const { jobId } = await createNodeJob({ route: { nodeUuid: node.uuid } })
                const pollResult = await pollUntilDone(jobId)

                if (pollResult) {
                    results.push({
                        nodeUuid: node.uuid,
                        nodeName: node.name,
                        users: pollResult.users,
                        countryCode: node.countryCode
                    })
                    completed++
                } else {
                    failed++
                }
            } catch (err: unknown) {
                if (isAbortError(err)) throw err
                failed++
            } finally {
                activeNodesMap.delete(node.uuid)
                syncProgress()
            }
        }

        try {
            await runWithConcurrency(targetNodes, processNode, MAX_CONCURRENT, signal)

            if (signal.aborted) return

            const { sorted, totalIpCount, uniqueIpCount } = aggregateResults(results)

            setAggregatedUsers(sorted)
            setStats({
                totalIps: totalIpCount,
                uniqueIps: uniqueIpCount,
                totalUsers: sorted.length,
                nodesScanned: completed,
                nodesFailed: failed
            })
            setPhase(failed === total ? 'failed' : 'completed')
        } catch (err: unknown) {
            if (isAbortError(err)) return
            setPhase('failed')
        }
    }

    const reset = () => {
        abortRef.current?.abort()
        abortRef.current = null
        setPhase('idle')
        setProgress({ completed: 0, failed: 0, total: 0, activeNodes: [] })
        setAggregatedUsers([])
        setStats(null)
    }

    return { phase, progress, aggregatedUsers, stats, onlineNodes, start, reset }
}
