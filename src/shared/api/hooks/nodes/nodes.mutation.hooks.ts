import {
    CreateNodeCommand,
    DeleteNodeCommand,
    DisableNodeCommand,
    EnableNodeCommand,
    ReorderNodeCommand,
    RestartAllNodesCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import {
    createDeleteMutationHook,
    createPatchMutationHook,
    createPostMutationHook
} from '../../tsq-helpers'

export const useCreateNode = createPostMutationHook({
    endpoint: CreateNodeCommand.TSQ_url,
    bodySchema: CreateNodeCommand.RequestSchema,
    responseSchema: CreateNodeCommand.ResponseSchema,
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
                title: `${CreateNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateNode = createPostMutationHook({
    endpoint: UpdateNodeCommand.TSQ_url,
    bodySchema: UpdateNodeCommand.RequestSchema,
    responseSchema: UpdateNodeCommand.ResponseSchema,
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
                title: `${UpdateNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteNode = createDeleteMutationHook({
    endpoint: DeleteNodeCommand.TSQ_url,
    responseSchema: DeleteNodeCommand.ResponseSchema,
    routeParamsSchema: DeleteNodeCommand.RequestSchema,
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
                title: `${DeleteNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useEnableNode = createPatchMutationHook({
    endpoint: EnableNodeCommand.TSQ_url,
    responseSchema: EnableNodeCommand.ResponseSchema,
    routeParamsSchema: EnableNodeCommand.RequestSchema,
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
                title: `${EnableNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDisableNode = createPatchMutationHook({
    endpoint: DisableNodeCommand.TSQ_url,
    responseSchema: DisableNodeCommand.ResponseSchema,
    routeParamsSchema: DisableNodeCommand.RequestSchema,
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
                title: `${DisableNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRestartAllNodes = createPatchMutationHook({
    endpoint: RestartAllNodesCommand.TSQ_url,
    responseSchema: RestartAllNodesCommand.ResponseSchema,

    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Please wait while nodes will reconnect',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${RestartAllNodesCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
export const useReorderNodes = createPostMutationHook({
    endpoint: ReorderNodeCommand.TSQ_url,
    bodySchema: ReorderNodeCommand.RequestSchema,
    responseSchema: ReorderNodeCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${ReorderNodeCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
