import {
    GetAllNodesCommand,
    NodesSchema,
    NodeSystemSchema,
    NodeSystemStatsSchema
} from '@remnawave/backend-contract'
import { z } from 'zod'

const PublicIpProbeSchema = z.object({
    publicIp: z.string().nullable(),
    reachable: z.boolean(),
    lastError: z.string().nullable()
})

export const HostConnectivitySchema = z.object({
    publicIpv4: z.string().nullable(),
    publicIpv6: z.string().nullable(),
    supportsIpv4: z.boolean(),
    supportsIpv6: z.boolean(),
    ipv4: PublicIpProbeSchema.nullable(),
    ipv6: PublicIpProbeSchema.nullable(),
    lastError: z.string().nullable()
})

const WarpTraceSchema = z.object({
    publicIp: z.string().nullable(),
    warp: z.enum(['on', 'off', 'unknown']),
    colo: z.string().nullable()
})

export const WarpOperationSchema = z.object({
    state: z.enum(['idle', 'installing', 'enabling', 'disabling', 'uninstalling', 'error']),
    startedAt: z.string().nullable(),
    finishedAt: z.string().nullable(),
    step: z.string().nullable(),
    logs: z.array(z.string())
})

export const WarpStatusSchema = z.object({
    installed: z.boolean(),
    running: z.boolean(),
    interfaceName: z.string().nullable(),
    publicIp: z.string().nullable(),
    publicIpv4: z.string().nullable(),
    publicIpv6: z.string().nullable(),
    warp: z.enum(['on', 'off', 'unknown']),
    colo: z.string().nullable(),
    ipv4: WarpTraceSchema.nullable(),
    ipv6: WarpTraceSchema.nullable(),
    operation: WarpOperationSchema,
    lastError: z.string().nullable()
})

export const NodeSystemStatsWithWarpSchema = NodeSystemStatsSchema.extend({
    host: HostConnectivitySchema.optional(),
    warp: WarpStatusSchema.optional()
})

export const NodeSystemWithWarpSchema = NodeSystemSchema.extend({
    stats: NodeSystemStatsWithWarpSchema
})

export const NodeWithWarpSchema = NodesSchema.extend({
    system: z.nullable(NodeSystemWithWarpSchema)
})

export const NodeWarpRouteSchema = z.object({
    uuid: z.string().uuid()
})

export const NodeWarpActionResponseSchema = z.object({
    response: NodeWithWarpSchema
})

export const NodeWarpStatusResponseSchema = z.object({
    response: WarpStatusSchema
})

export const GetAllNodesWithWarpResponseSchema = z.object({
    response: z.array(NodeWithWarpSchema)
})

export const GetOneNodeWithWarpResponseSchema = z.object({
    response: NodeWithWarpSchema
})

export const NODE_WARP_ENDPOINTS = {
    STATUS: '/api/nodes/:uuid/actions/warp/status',
    INSTALL: '/api/nodes/:uuid/actions/warp/install',
    ENABLE: '/api/nodes/:uuid/actions/warp/enable',
    DISABLE: '/api/nodes/:uuid/actions/warp/disable',
    UNINSTALL: '/api/nodes/:uuid/actions/warp/uninstall'
} as const

export type TWarpStatus = z.infer<typeof WarpStatusSchema>
export type TWarpOperation = z.infer<typeof WarpOperationSchema>
export type THostConnectivity = z.infer<typeof HostConnectivitySchema>
export type TNodeWithWarp = z.infer<typeof NodeWithWarpSchema>
export type TNodesWithWarp = GetAllNodesCommand.Response['response'][number] & TNodeWithWarp
export type TNodeWarpCarrier = {
    system: null | {
        stats: object
    }
}

export function getNodeWarpStatus(node: TNodeWarpCarrier): null | TWarpStatus {
    const stats = node.system?.stats as undefined | { warp?: null | TWarpStatus }
    return stats?.warp ?? null
}

export function getNodeHostConnectivity(node: TNodeWarpCarrier): null | THostConnectivity {
    const stats = node.system?.stats as undefined | { host?: null | THostConnectivity }
    return stats?.host ?? null
}

export function isNodeWarpOperationPending(warp: null | TWarpStatus) {
    return !!warp?.operation && !['error', 'idle'].includes(warp.operation.state)
}

export function getWarpOperationLabel(operation?: null | TWarpOperation) {
    if (!operation || operation.state === 'idle') return 'Idle'
    if (operation.state === 'installing') return 'Installing'
    if (operation.state === 'enabling') return 'Enabling'
    if (operation.state === 'disabling') return 'Disabling'
    if (operation.state === 'uninstalling') return 'Uninstalling'
    return 'Error'
}

export function getNodeWarpUiState(warp: null | TWarpStatus) {
    if (!warp) {
        return {
            color: 'gray',
            isRunning: false,
            label: 'WARP --',
            shortLabel: 'WARP',
            tooltip: 'WARP status unavailable'
        }
    }

    if (isNodeWarpOperationPending(warp)) {
        const label = getWarpOperationLabel(warp.operation)

        return {
            color: 'blue',
            isRunning: warp.running && warp.warp === 'on',
            label: `WARP ${label.toUpperCase()}`,
            shortLabel: label.toUpperCase().slice(0, 4),
            tooltip: warp.operation.step ?? `${label} WARP`
        }
    }

    if (warp.lastError) {
        return {
            color: 'red',
            isRunning: false,
            label: 'WARP ERR',
            shortLabel: 'ERR',
            tooltip: warp.lastError
        }
    }

    if (warp.running && warp.warp === 'on') {
        const edge = warp.colo ? ` · ${warp.colo}` : ''
        const ips = [warp.publicIpv4, warp.publicIpv6].filter(Boolean).join(' / ')

        return {
            color: 'teal',
            isRunning: true,
            label: 'WARP ON',
            shortLabel: 'ON',
            tooltip: `${ips || warp.publicIp || 'WARP'}${edge}`
        }
    }

    if (warp.installed) {
        return {
            color: 'gray',
            isRunning: false,
            label: 'WARP OFF',
            shortLabel: 'OFF',
            tooltip: 'WARP installed but stopped'
        }
    }

    return {
        color: 'yellow',
        isRunning: false,
        label: 'WARP MISSING',
        shortLabel: 'MISS',
        tooltip: 'WARP is not installed'
    }
}
