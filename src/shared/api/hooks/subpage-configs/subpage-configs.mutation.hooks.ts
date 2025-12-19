import {
    CloneSubscriptionPageConfigCommand,
    CreateSubscriptionPageConfigCommand,
    DeleteSubscriptionPageConfigCommand,
    ReorderSubscriptionPageConfigsCommand,
    UpdateSubscriptionPageConfigCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateSubscriptionPageConfig = createMutationHook({
    endpoint: UpdateSubscriptionPageConfigCommand.TSQ_url,
    bodySchema: UpdateSubscriptionPageConfigCommand.RequestSchema,
    responseSchema: UpdateSubscriptionPageConfigCommand.ResponseSchema,
    requestMethod: UpdateSubscriptionPageConfigCommand.endpointDetails.REQUEST_METHOD,
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

export const useCreateSubscriptionPageConfig = createMutationHook({
    endpoint: CreateSubscriptionPageConfigCommand.TSQ_url,
    bodySchema: CreateSubscriptionPageConfigCommand.RequestSchema,
    responseSchema: CreateSubscriptionPageConfigCommand.ResponseSchema,
    requestMethod: CreateSubscriptionPageConfigCommand.endpointDetails.REQUEST_METHOD,
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

export const useDeleteSubscriptionPageConfig = createMutationHook({
    endpoint: DeleteSubscriptionPageConfigCommand.TSQ_url,
    routeParamsSchema: DeleteSubscriptionPageConfigCommand.RequestSchema,
    responseSchema: DeleteSubscriptionPageConfigCommand.ResponseSchema,
    requestMethod: DeleteSubscriptionPageConfigCommand.endpointDetails.REQUEST_METHOD,
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

export const useReorderSubscriptionPageConfigs = createMutationHook({
    endpoint: ReorderSubscriptionPageConfigsCommand.TSQ_url,
    bodySchema: ReorderSubscriptionPageConfigsCommand.RequestSchema,
    responseSchema: ReorderSubscriptionPageConfigsCommand.ResponseSchema,
    requestMethod: ReorderSubscriptionPageConfigsCommand.endpointDetails.REQUEST_METHOD,
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

export const useCloneSubscriptionPageConfig = createMutationHook({
    endpoint: CloneSubscriptionPageConfigCommand.TSQ_url,
    bodySchema: CloneSubscriptionPageConfigCommand.RequestSchema,
    responseSchema: CloneSubscriptionPageConfigCommand.ResponseSchema,
    requestMethod: CloneSubscriptionPageConfigCommand.endpointDetails.REQUEST_METHOD,
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
