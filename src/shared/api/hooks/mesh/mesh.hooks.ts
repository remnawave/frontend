import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { sToMs } from '@shared/utils/time-utils'

import { instance } from '../../axios'

// The mesh controller is a separate service; its API is proxied by the panel at /api/mesh.
// Schemas are local on purpose: the contract package does not know about it.

const ProbeRatioSchema = z.record(z.string(), z.record(z.string(), z.number()))

const ExitSchema = z.object({
    direct_healthy: z.boolean().nullable(),
    from_cluster: z.number().nullable(),
    path: z.string(),
    per_entry: ProbeRatioSchema,
    wg_healthy: z.boolean().nullable()
})

const LinkSchema = z.object({
    loss: z.number().optional(),
    ok: z.boolean(),
    rtt: z.number().nullable().optional()
})

export const JobSchema = z.object({
    error: z.string().nullable().optional(),
    id: z.string(),
    kind: z.string(),
    status: z.string(),
    steps: z.array(z.object({ t: z.string(), text: z.string() })),
    title: z.string()
})

export const MeshStatusSchema = z.object({
    control_plane: z
        .object({
            mode: z.string(),
            desired_members: z.array(z.string()),
            pending_cleanup: z.array(z.string())
        })
        .default({ mode: 'etcd', desired_members: [], pending_cleanup: [] }),
    auto_balancer: z.boolean(),
    auto_ip_update: z.boolean().default(false),
    auto_relay: z.boolean().default(false),
    auto_switch: z.boolean(),
    balancer_disabled: z.record(z.string(), z.boolean()),
    balancer_error: z.string().nullable().optional(),
    balancer_selector: z.string().nullable().optional(),
    balancer_routing_mode: z.string().default('direct'),
    balancer_routes: z
        .record(
            z.string(),
            z.object({
                address: z.string().nullable(),
                path: z.string(),
                healthy: z.boolean().nullable()
            })
        )
        .default({}),
    relay_modes: z.record(z.string(), z.enum(['auto', 'direct', 'relay'])).default({}),
    capabilities: z
        .object({
            node_management: z.boolean(),
            membership: z.boolean(),
            relay: z.boolean(),
            ip_update: z.boolean(),
            balancer: z.boolean()
        })
        .default({
            node_management: false,
            membership: false,
            relay: false,
            ip_update: false,
            balancer: false
        }),
    cycles: z.number(),
    entries_ssh: z.record(z.string(), z.boolean()),
    etcd_mtls: z.boolean().default(false),
    etcd_operation: z
        .object({
            name: z.string(),
            kind: z.string(),
            stage: z.string(),
            error: z.string().nullable().optional(),
            cleanup_pending: z.boolean().optional()
        })
        .nullable()
        .default(null),
    events: z.array(
        z.object({
            kind: z.string().default('info'),
            msg: z.string(),
            node: z.string().nullable().optional(),
            t: z.string()
        })
    ),
    exits: z.record(z.string(), ExitSchema),
    exits_nodes: z.record(z.string(), z.string().nullable()),
    inventory: z
        .record(
            z.string(),
            z.object({
                host: z.string().nullable().optional(),
                overlay: z.string().nullable().optional(),
                role: z.string().nullable().optional(),
                rw_node: z.string().nullable().optional()
            })
        )
        .default({}),
    jobs: z.array(JobSchema).default([]),
    last_cycle: z.number(),
    overlay: z.object({
        etcd_up: z.boolean(),
        nodes: z.record(z.string(), z.unknown()),
        obs: z.record(z.string(), z.record(z.string(), LinkSchema)),
        route: z.record(z.string(), z.record(z.string(), z.string()))
    }),
    pinned_disabled: z.array(z.string()),
    quorum: z
        .object({
            healthy: z.number(),
            leader: z.string().nullable(),
            members: z.array(
                z.object({
                    db_size: z.number().optional(),
                    endpoint: z.string().default(''),
                    healthy: z.boolean(),
                    leader: z.boolean().optional(),
                    name: z.string(),
                    raft_index: z.number().optional(),
                    raft_term: z.number().optional(),
                    version: z.string().nullable().optional()
                })
            ),
            quorum: z.boolean().nullable(),
            size: z.number()
        })
        .default({ healthy: 0, leader: null, members: [], quorum: null, size: 0 }),
    topology: z
        .object({
            nodes: z.array(
                z.object({
                    added: z.boolean().optional(),
                    agent_age: z.number().nullable().optional(),
                    etcd: z.boolean(),
                    leader: z.boolean(),
                    name: z.string(),
                    overlay: z.string().nullable().optional(),
                    relay: z.boolean().optional(),
                    role: z.string(),
                    underlay: z.string().nullable().optional()
                })
            )
        })
        .default({ nodes: [] }),
    relay_capable: z.array(z.string()).default([]),
    relays: z
        .record(
            z.string(),
            z.object({
                hosts: z.number(),
                on: z.boolean(),
                reason: z.string().nullable().optional(),
                pending: z.boolean().optional(),
                target: z.boolean().nullable().optional()
            })
        )
        .default({})
})

export type MeshStatus = z.infer<typeof MeshStatusSchema>
export type MeshJob = z.infer<typeof JobSchema>
export type MeshEvent = MeshStatus['events'][number]

export interface AddMeshNodeRequest {
    etcd?: boolean
    host_key_fingerprint?: string
    host: string
    name: string
    password?: string
    private_key?: string
    role: 'entry' | 'exit'
    rw_node?: string
    user?: string
}

const meshKeys = {
    job: (id: string) => ['mesh', 'job', id] as const,
    status: ['mesh', 'status'] as const
}

export const useGetMeshStatus = () =>
    useQuery({
        queryKey: meshKeys.status,
        queryFn: async ({ signal }) => {
            const res = await instance.get<{ response: unknown }>('/api/mesh/status', { signal })
            return MeshStatusSchema.parse(res.data.response)
        },
        refetchInterval: (query) =>
            (query.state.error as { response?: { status?: number } })?.response?.status === 503
                ? false
                : sToMs(10),
        staleTime: sToMs(5),
        retry: 1
    })

export const useGetMeshJob = (id: null | string) =>
    useQuery({
        enabled: !!id,
        gcTime: 0,
        queryKey: meshKeys.job(id ?? ''),
        queryFn: async ({ signal }) => {
            const res = await instance.get<{ response: unknown }>(
                `/api/mesh/jobs/${encodeURIComponent(id ?? '')}`,
                { signal }
            )
            return JobSchema.parse(res.data.response)
        },
        // poll while the job runs; the query is dropped as soon as the dialog is closed
        refetchInterval: (query) => (query.state.data?.status === 'running' ? 2000 : false),
        retry: 1
    })

function useMeshMutation<TVars, TRes = unknown>(
    path: string,
    successMessage: 'saved' | 'probeStarted' | null
) {
    const queryClient = useQueryClient()
    const { t } = useTranslation(undefined, { keyPrefix: 'mesh' })
    return useMutation({
        gcTime: 0,
        mutationFn: async (vars: TVars) => {
            const res = await instance.post<{ response: TRes }>(path, vars ?? {})
            return res.data.response
        },
        onSuccess: () => {
            if (successMessage) {
                notifications.show({ color: 'teal', message: t(successMessage), title: 'Mesh' })
            }
            void queryClient.invalidateQueries({ queryKey: meshKeys.status })
        },
        onError: () => {
            notifications.show({ color: 'red', message: t('requestFailed'), title: 'Mesh' })
        }
    })
}

export const useSetMeshFlags = () =>
    useMeshMutation<{
        auto_balancer?: boolean
        auto_ip_update?: boolean
        auto_relay?: boolean
        auto_switch?: boolean
    }>('/api/mesh/flags', 'saved')

export const usePinMeshNode = () =>
    useMeshMutation<{ node: string; pinned: boolean }>('/api/mesh/pin', 'saved')

export const useMeshProbeNow = () => useMeshMutation<undefined>('/api/mesh/probe', 'probeStarted')

export const useSetMeshRelay = () =>
    useMeshMutation<{ exit: string; mode: 'auto' | 'direct' | 'relay' }>('/api/mesh/relay', 'saved')

export const useAddMeshNode = () =>
    useMeshMutation<AddMeshNodeRequest, { job: string }>('/api/mesh/nodes', null)

export const useRemoveMeshNode = () =>
    useMeshMutation<{ name: string }, { job: string }>('/api/mesh/nodes/remove', null)

export const useSetMeshEtcdMember = () =>
    useMeshMutation<{ name: string; member: boolean }, { job: string }>('/api/mesh/etcd', null)

export const useTeardownMesh = () =>
    useMeshMutation<{ confirm: 'REMOVE_MESH' }, { job: string }>('/api/mesh/teardown', null)
