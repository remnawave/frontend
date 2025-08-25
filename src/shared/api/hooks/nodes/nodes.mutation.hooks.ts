import {
    CreateNodeCommand,
    DeleteNodeCommand,
    DisableNodeCommand,
    EnableNodeCommand,
    ReorderNodeCommand,
    RestartAllNodesCommand,
    RestartNodeCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateNode = createMutationHook({
    endpoint: CreateNodeCommand.TSQ_url,
    bodySchema: CreateNodeCommand.RequestSchema,
    responseSchema: CreateNodeCommand.ResponseSchema,
    requestMethod: CreateNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateNode = createMutationHook({
    endpoint: UpdateNodeCommand.TSQ_url,
    bodySchema: UpdateNodeCommand.RequestSchema,
    responseSchema: UpdateNodeCommand.ResponseSchema,
    requestMethod: UpdateNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteNode = createMutationHook({
    endpoint: DeleteNodeCommand.TSQ_url,
    responseSchema: DeleteNodeCommand.ResponseSchema,
    routeParamsSchema: DeleteNodeCommand.RequestSchema,
    requestMethod: DeleteNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useEnableNode = createMutationHook({
    endpoint: EnableNodeCommand.TSQ_url,
    responseSchema: EnableNodeCommand.ResponseSchema,
    routeParamsSchema: EnableNodeCommand.RequestSchema,
    requestMethod: EnableNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node enabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Enable Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDisableNode = createMutationHook({
    endpoint: DisableNodeCommand.TSQ_url,
    responseSchema: DisableNodeCommand.ResponseSchema,
    routeParamsSchema: DisableNodeCommand.RequestSchema,
    requestMethod: DisableNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node disabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Disable Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRestartAllNodes = createMutationHook({
    endpoint: RestartAllNodesCommand.TSQ_url,
    responseSchema: RestartAllNodesCommand.ResponseSchema,
    bodySchema: RestartAllNodesCommand.RequestBodySchema,
    requestMethod: RestartAllNodesCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Please wait for the nodes to reconnect',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Restart All Nodes`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
export const useReorderNodes = createMutationHook({
    endpoint: ReorderNodeCommand.TSQ_url,
    bodySchema: ReorderNodeCommand.RequestSchema,
    responseSchema: ReorderNodeCommand.ResponseSchema,
    requestMethod: ReorderNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Reorder Nodes`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRestartNode = createMutationHook({
    endpoint: RestartNodeCommand.TSQ_url,
    responseSchema: RestartNodeCommand.ResponseSchema,
    routeParamsSchema: RestartNodeCommand.RequestSchema,
    requestMethod: RestartNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node restarted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Restart Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
