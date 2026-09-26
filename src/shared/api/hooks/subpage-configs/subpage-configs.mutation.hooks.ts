import { notifications } from '@mantine/notifications'
import {
    CloneSubpageConfigCommand,
    CreateSubpageConfigCommand,
    DeleteSubpageConfigCommand,
    ReorderSubpageConfigsCommand,
    SetSubpageConfigTagsCommand,
    UpdateSubpageConfigCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateSubpageConfig = createMutationHook({
    endpoint: UpdateSubpageConfigCommand.TSQ_url,
    bodySchema: UpdateSubpageConfigCommand.RequestBodySchema,
    responseSchema: UpdateSubpageConfigCommand.ResponseSchema,
    requestMethod: UpdateSubpageConfigCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription page config updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Subscription Page Config`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateSubpageConfig = createMutationHook({
    endpoint: CreateSubpageConfigCommand.TSQ_url,
    bodySchema: CreateSubpageConfigCommand.RequestBodySchema,
    responseSchema: CreateSubpageConfigCommand.ResponseSchema,
    requestMethod: CreateSubpageConfigCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription page config created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Subscription Page Config`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteSubpageConfig = createMutationHook({
    endpoint: DeleteSubpageConfigCommand.TSQ_url,
    routeParamsSchema: DeleteSubpageConfigCommand.RequestParamSchema,
    requestMethod: DeleteSubpageConfigCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription page config deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Subscription Page Config`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useReorderSubpageConfigs = createMutationHook({
    endpoint: ReorderSubpageConfigsCommand.TSQ_url,
    bodySchema: ReorderSubpageConfigsCommand.RequestBodySchema,
    responseSchema: ReorderSubpageConfigsCommand.ResponseSchema,
    requestMethod: ReorderSubpageConfigsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Reorder Subscription Page Configs`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCloneSubpageConfig = createMutationHook({
    endpoint: CloneSubpageConfigCommand.TSQ_url,
    bodySchema: CloneSubpageConfigCommand.RequestBodySchema,
    responseSchema: CloneSubpageConfigCommand.ResponseSchema,
    requestMethod: CloneSubpageConfigCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription page config cloned successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Clone Subscription Page Config`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSetSubpageConfigsTags = createMutationHook({
    endpoint: SetSubpageConfigTagsCommand.TSQ_url,
    bodySchema: SetSubpageConfigTagsCommand.RequestBodySchema,
    responseSchema: SetSubpageConfigTagsCommand.ResponseSchema,
    requestMethod: SetSubpageConfigTagsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: 'Update tags',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
