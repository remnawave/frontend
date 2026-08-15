import { notifications } from '@mantine/notifications'
import {
    CreateNodeIntegrationCommand,
    DeleteNodeIntegrationCommand,
    UpdateNodeIntegrationCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateNodeIntegration = createMutationHook({
    endpoint: CreateNodeIntegrationCommand.TSQ_url,
    bodySchema: CreateNodeIntegrationCommand.RequestBodySchema,
    responseSchema: CreateNodeIntegrationCommand.ResponseSchema,
    requestMethod: CreateNodeIntegrationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node integration created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Node Integration`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateNodeIntegration = createMutationHook({
    endpoint: UpdateNodeIntegrationCommand.TSQ_url,
    bodySchema: UpdateNodeIntegrationCommand.RequestBodySchema,
    responseSchema: UpdateNodeIntegrationCommand.ResponseSchema,
    requestMethod: UpdateNodeIntegrationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node integration updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Node Integration`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteNodeIntegration = createMutationHook({
    endpoint: DeleteNodeIntegrationCommand.TSQ_url,
    routeParamsSchema: DeleteNodeIntegrationCommand.RequestParamSchema,
    requestMethod: DeleteNodeIntegrationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Node integration deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Node Integration`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
