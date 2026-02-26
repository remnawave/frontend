import {
    CloneNodePluginCommand,
    CreateNodePluginCommand,
    DeleteNodePluginCommand,
    ReorderNodePluginCommand,
    UpdateNodePluginCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateNodePlugin = createMutationHook({
    endpoint: UpdateNodePluginCommand.TSQ_url,
    bodySchema: UpdateNodePluginCommand.RequestSchema,
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
    bodySchema: CreateNodePluginCommand.RequestSchema,
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
    routeParamsSchema: DeleteNodePluginCommand.RequestSchema,
    responseSchema: DeleteNodePluginCommand.ResponseSchema,
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
    bodySchema: ReorderNodePluginCommand.RequestSchema,
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
    bodySchema: CloneNodePluginCommand.RequestSchema,
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
