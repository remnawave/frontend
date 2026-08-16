import { notifications } from '@mantine/notifications'
import {
    CloneNodePluginCommand,
    CreateNodePluginCommand,
    CreateSharedListCommand,
    DeleteNodePluginCommand,
    DeleteSharedListCommand,
    PluginExecutorCommand,
    ReorderNodePluginCommand,
    SyncNodePluginCommand,
    SyncSharedListCommand,
    TruncateTorrentBlockerReportsCommand,
    UpdateNodePluginCommand,
    UpdateSharedListCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateNodePlugin = createMutationHook({
    endpoint: UpdateNodePluginCommand.TSQ_url,
    bodySchema: UpdateNodePluginCommand.RequestBodySchema,
    responseSchema: UpdateNodePluginCommand.ResponseSchema,
    requestMethod: UpdateNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node plugin updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Node Plugin`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateNodePlugin = createMutationHook({
    endpoint: CreateNodePluginCommand.TSQ_url,
    bodySchema: CreateNodePluginCommand.RequestBodySchema,
    responseSchema: CreateNodePluginCommand.ResponseSchema,
    requestMethod: CreateNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node plugin created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Node Plugin`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteNodePlugin = createMutationHook({
    endpoint: DeleteNodePluginCommand.TSQ_url,
    routeParamsSchema: DeleteNodePluginCommand.RequestParamSchema,
    requestMethod: DeleteNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node plugin deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Node Plugin`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useReorderNodePlugins = createMutationHook({
    endpoint: ReorderNodePluginCommand.TSQ_url,
    bodySchema: ReorderNodePluginCommand.RequestBodySchema,
    responseSchema: ReorderNodePluginCommand.ResponseSchema,
    requestMethod: ReorderNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Reorder Node Plugins`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCloneNodePlugin = createMutationHook({
    endpoint: CloneNodePluginCommand.TSQ_url,
    bodySchema: CloneNodePluginCommand.RequestBodySchema,
    responseSchema: CloneNodePluginCommand.ResponseSchema,
    requestMethod: CloneNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node plugin cloned successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Clone Node Plugin`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useNodePluginExecutor = createMutationHook({
    endpoint: PluginExecutorCommand.TSQ_url,
    bodySchema: PluginExecutorCommand.RequestBodySchema,
    requestMethod: PluginExecutorCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Request sent',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Node Plugin Executor`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useTruncateTorrentBlockerReports = createMutationHook({
    endpoint: TruncateTorrentBlockerReportsCommand.TSQ_url,
    requestMethod: TruncateTorrentBlockerReportsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Reports truncated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Truncate Torrent Blocker Reports`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSyncNodePlugin = createMutationHook({
    endpoint: SyncNodePluginCommand.TSQ_url,
    bodySchema: SyncNodePluginCommand.RequestBodySchema,
    requestMethod: SyncNodePluginCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Sync queued for nodes with this plugin',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Sync Node Plugin`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateSharedList = createMutationHook({
    endpoint: CreateSharedListCommand.TSQ_url,
    bodySchema: CreateSharedListCommand.RequestBodySchema,
    responseSchema: CreateSharedListCommand.ResponseSchema,
    requestMethod: CreateSharedListCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Shared list created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Shared List`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateSharedList = createMutationHook({
    endpoint: UpdateSharedListCommand.TSQ_url,
    bodySchema: UpdateSharedListCommand.RequestBodySchema,
    responseSchema: UpdateSharedListCommand.ResponseSchema,
    requestMethod: UpdateSharedListCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Shared list updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Shared List`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteSharedList = createMutationHook({
    endpoint: DeleteSharedListCommand.TSQ_url,
    routeParamsSchema: DeleteSharedListCommand.RequestParamSchema,
    requestMethod: DeleteSharedListCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Shared list deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Shared List`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSyncSharedList = createMutationHook({
    endpoint: SyncSharedListCommand.TSQ_url,
    bodySchema: SyncSharedListCommand.RequestBodySchema,
    requestMethod: SyncSharedListCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Sync queued for nodes using this list',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Sync Shared List`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
