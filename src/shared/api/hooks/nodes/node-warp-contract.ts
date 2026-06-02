import {
    GetAllNodesCommand,
    NodeSystemSchema,
    NodeSystemStatsSchema,
    NodesSchema
} from '@remnawave/backend-contract'
import { z } from 'zod'

export const WarpStatusSchema = z.object({
    installed: z.boolean(),
    running: z.boolean(),
    interfaceName: z.string().nullable(),
    publicIp: z.string().nullable(),
    warp: z.enum(['on', 'off', 'unknown']),
    colo: z.string().nullable(),
    lastError: z.string().nullable()
})

export const NodeSystemStatsWithWarpSchema = NodeSystemStatsSchema.extend({
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

export const GetAllNodesWithWarpResponseSchema = z.object({
    response: z.array(NodeWithWarpSchema)
})

export const GetOneNodeWithWarpResponseSchema = z.object({
    response: NodeWithWarpSchema
})

export const NODE_WARP_ENDPOINTS = {
    ENABLE: '/api/nodes/:uuid/actions/warp/enable',
    DISABLE: '/api/nodes/:uuid/actions/warp/disable'
} as const

export type TWarpStatus = z.infer<typeof WarpStatusSchema>
export type TNodeWithWarp = z.infer<typeof NodeWithWarpSchema>
export type TNodesWithWarp = GetAllNodesCommand.Response['response'][number] & TNodeWithWarp
export type TNodeWarpCarrier = {
    system: {
        stats: object
    } | null
}

export function getNodeWarpStatus(node: TNodeWarpCarrier): TWarpStatus | null {
    const stats = node.system?.stats as { warp?: TWarpStatus | null } | undefined
    return stats?.warp ?? null
}

export function getNodeWarpUiState(warp: TWarpStatus | null) {
    if (!warp) {
        return {
            color: 'gray',
            isRunning: false,
            label: 'WARP --',
            shortLabel: 'WARP',
            tooltip: 'WARP status unavailable'
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

        return {
            color: 'teal',
            isRunning: true,
            label: 'WARP ON',
            shortLabel: 'ON',
            tooltip: `${warp.publicIp ?? 'WARP'}${edge}`
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
