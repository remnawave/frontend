import {
    CreateSubscriptionTemplateCommand,
    DeleteSubscriptionTemplateCommand,
    UpdateSubscriptionTemplateCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateSubscriptionTemplate = createMutationHook({
    endpoint: UpdateSubscriptionTemplateCommand.TSQ_url,
    bodySchema: UpdateSubscriptionTemplateCommand.RequestSchema,
    responseSchema: UpdateSubscriptionTemplateCommand.ResponseSchema,
    requestMethod: UpdateSubscriptionTemplateCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription template updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Subscription Template`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateSubscriptionTemplate = createMutationHook({
    endpoint: CreateSubscriptionTemplateCommand.TSQ_url,
    bodySchema: CreateSubscriptionTemplateCommand.RequestSchema,
    responseSchema: CreateSubscriptionTemplateCommand.ResponseSchema,
    requestMethod: CreateSubscriptionTemplateCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription template created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Subscription Template`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteSubscriptionTemplate = createMutationHook({
    endpoint: DeleteSubscriptionTemplateCommand.TSQ_url,
    routeParamsSchema: DeleteSubscriptionTemplateCommand.RequestSchema,
    responseSchema: DeleteSubscriptionTemplateCommand.ResponseSchema,
    requestMethod: DeleteSubscriptionTemplateCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription template deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Subscription Template`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
