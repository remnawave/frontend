import {
    CreateHostCommand,
    DeleteHostCommand,
    ReorderHostCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createDeleteMutationHook, createPostMutationHook } from '../../tsq-helpers'

export const useCreateHost = createPostMutationHook({
    endpoint: CreateHostCommand.TSQ_url,
    bodySchema: CreateHostCommand.RequestSchema,
    responseSchema: CreateHostCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Host created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${CreateHostCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateHost = createPostMutationHook({
    endpoint: UpdateHostCommand.TSQ_url,
    bodySchema: UpdateHostCommand.RequestSchema,
    responseSchema: UpdateHostCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Host updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${UpdateHostCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteHost = createDeleteMutationHook({
    endpoint: DeleteHostCommand.TSQ_url,
    responseSchema: DeleteHostCommand.ResponseSchema,
    routeParamsSchema: DeleteHostCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Host deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${DeleteHostCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useReorderHosts = createPostMutationHook({
    endpoint: ReorderHostCommand.TSQ_url,
    bodySchema: ReorderHostCommand.RequestSchema,
    responseSchema: ReorderHostCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${ReorderHostCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
