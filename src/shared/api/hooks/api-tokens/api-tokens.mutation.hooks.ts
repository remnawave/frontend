import { CreateApiTokenCommand, DeleteApiTokenCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createDeleteMutationHook, createPostMutationHook } from '../../tsq-helpers'

export const useCreateApiToken = createPostMutationHook({
    endpoint: CreateApiTokenCommand.TSQ_url,
    bodySchema: CreateApiTokenCommand.RequestSchema,
    responseSchema: CreateApiTokenCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Api token created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${CreateApiTokenCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteApiToken = createDeleteMutationHook({
    endpoint: DeleteApiTokenCommand.TSQ_url,
    responseSchema: DeleteApiTokenCommand.ResponseSchema,
    routeParamsSchema: DeleteApiTokenCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Api token deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${DeleteApiTokenCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
