import { CreateApiTokenCommand, DeleteApiTokenCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '@shared/api/tsq-helpers/create-mutation-hook'

export const useCreateApiToken = createMutationHook({
    endpoint: CreateApiTokenCommand.TSQ_url,
    bodySchema: CreateApiTokenCommand.RequestSchema,
    responseSchema: CreateApiTokenCommand.ResponseSchema,
    requestMethod: CreateApiTokenCommand.endpointDetails.REQUEST_METHOD,
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
                title: `Create Api Token`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteApiToken = createMutationHook({
    endpoint: DeleteApiTokenCommand.TSQ_url,
    responseSchema: DeleteApiTokenCommand.ResponseSchema,
    routeParamsSchema: DeleteApiTokenCommand.RequestSchema,
    requestMethod: DeleteApiTokenCommand.endpointDetails.REQUEST_METHOD,
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
                title: `Delete Api Token`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
