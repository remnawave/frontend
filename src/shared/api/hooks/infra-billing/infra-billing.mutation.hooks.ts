import {
    CreateInfraBillingHistoryRecordCommand,
    CreateInfraBillingNodeCommand,
    CreateInfraProviderCommand,
    DeleteInfraBillingHistoryRecordCommand,
    DeleteInfraBillingNodeByUuidCommand,
    DeleteInfraProviderByUuidCommand,
    UpdateInfraBillingNodeCommand,
    UpdateInfraProviderCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateInfraProvider = createMutationHook({
    endpoint: UpdateInfraProviderCommand.TSQ_url,
    bodySchema: UpdateInfraProviderCommand.RequestSchema,
    responseSchema: UpdateInfraProviderCommand.ResponseSchema,
    requestMethod: UpdateInfraProviderCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Provider updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Infra Provider`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteInfraProvider = createMutationHook({
    endpoint: DeleteInfraProviderByUuidCommand.TSQ_url,
    responseSchema: DeleteInfraProviderByUuidCommand.ResponseSchema,
    routeParamsSchema: DeleteInfraProviderByUuidCommand.RequestSchema,
    requestMethod: DeleteInfraProviderByUuidCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Provider deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Infra Provider`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateInfraProvider = createMutationHook({
    endpoint: CreateInfraProviderCommand.TSQ_url,
    responseSchema: CreateInfraProviderCommand.ResponseSchema,
    bodySchema: CreateInfraProviderCommand.RequestSchema,
    requestMethod: CreateInfraProviderCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Provider created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Infra Provider`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteInfraBillingHistoryRecord = createMutationHook({
    endpoint: DeleteInfraBillingHistoryRecordCommand.TSQ_url,
    responseSchema: DeleteInfraBillingHistoryRecordCommand.ResponseSchema,
    routeParamsSchema: DeleteInfraBillingHistoryRecordCommand.RequestSchema,
    requestMethod: DeleteInfraBillingHistoryRecordCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Billing History Record deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Infra Billing History Record`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateInfraBillingHistoryRecord = createMutationHook({
    endpoint: CreateInfraBillingHistoryRecordCommand.TSQ_url,
    responseSchema: CreateInfraBillingHistoryRecordCommand.ResponseSchema,
    bodySchema: CreateInfraBillingHistoryRecordCommand.RequestSchema,
    requestMethod: CreateInfraBillingHistoryRecordCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Billing History Record created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Infra Billing History Record`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateInfraBillingNode = createMutationHook({
    endpoint: CreateInfraBillingNodeCommand.TSQ_url,
    responseSchema: CreateInfraBillingNodeCommand.ResponseSchema,
    bodySchema: CreateInfraBillingNodeCommand.RequestSchema,
    requestMethod: CreateInfraBillingNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Billing Node created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Infra Billing Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteInfraBillingNode = createMutationHook({
    endpoint: DeleteInfraBillingNodeByUuidCommand.TSQ_url,
    responseSchema: DeleteInfraBillingNodeByUuidCommand.ResponseSchema,
    routeParamsSchema: DeleteInfraBillingNodeByUuidCommand.RequestSchema,
    requestMethod: DeleteInfraBillingNodeByUuidCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Billing Node deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Infra Billing Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateInfraBillingNode = createMutationHook({
    endpoint: UpdateInfraBillingNodeCommand.TSQ_url,
    bodySchema: UpdateInfraBillingNodeCommand.RequestSchema,
    responseSchema: UpdateInfraBillingNodeCommand.ResponseSchema,
    requestMethod: UpdateInfraBillingNodeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Infra Billing Node updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Infra Billing Node`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
