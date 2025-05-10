import {
    BulkDeleteHostsCommand,
    BulkDisableHostsCommand,
    BulkEnableHostsCommand,
    CreateHostCommand,
    DeleteHostCommand,
    ReorderHostCommand,
    SetInboundToManyHostsCommand,
    SetPortToManyHostsCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateHost = createMutationHook({
    endpoint: CreateHostCommand.TSQ_url,
    bodySchema: CreateHostCommand.RequestSchema,
    responseSchema: CreateHostCommand.ResponseSchema,
    requestMethod: CreateHostCommand.endpointDetails.REQUEST_METHOD,
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
                title: `Create Host`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateHost = createMutationHook({
    endpoint: UpdateHostCommand.TSQ_url,
    bodySchema: UpdateHostCommand.RequestSchema,
    responseSchema: UpdateHostCommand.ResponseSchema,
    requestMethod: UpdateHostCommand.endpointDetails.REQUEST_METHOD,
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
                title: `Update Host`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteHost = createMutationHook({
    endpoint: DeleteHostCommand.TSQ_url,
    responseSchema: DeleteHostCommand.ResponseSchema,
    routeParamsSchema: DeleteHostCommand.RequestSchema,
    requestMethod: DeleteHostCommand.endpointDetails.REQUEST_METHOD,
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
                title: `Delete Host`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useReorderHosts = createMutationHook({
    endpoint: ReorderHostCommand.TSQ_url,
    bodySchema: ReorderHostCommand.RequestSchema,
    responseSchema: ReorderHostCommand.ResponseSchema,
    requestMethod: ReorderHostCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Reorder Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkDeleteHosts = createMutationHook({
    endpoint: BulkDeleteHostsCommand.TSQ_url,
    bodySchema: BulkDeleteHostsCommand.RequestSchema,
    responseSchema: BulkDeleteHostsCommand.ResponseSchema,
    requestMethod: BulkDeleteHostsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Hosts deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Bulk Delete Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkEnableHosts = createMutationHook({
    endpoint: BulkEnableHostsCommand.TSQ_url,
    bodySchema: BulkEnableHostsCommand.RequestSchema,
    responseSchema: BulkEnableHostsCommand.ResponseSchema,
    requestMethod: BulkEnableHostsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Hosts enabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Bulk Enable Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkDisableHosts = createMutationHook({
    endpoint: BulkDisableHostsCommand.TSQ_url,
    bodySchema: BulkDisableHostsCommand.RequestSchema,
    responseSchema: BulkDisableHostsCommand.ResponseSchema,
    requestMethod: BulkDisableHostsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Hosts disabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Bulk Disable Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSetInboundHosts = createMutationHook({
    endpoint: SetInboundToManyHostsCommand.TSQ_url,
    bodySchema: SetInboundToManyHostsCommand.RequestSchema,
    responseSchema: SetInboundToManyHostsCommand.ResponseSchema,
    requestMethod: SetInboundToManyHostsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Hosts inbound set successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Set Inbound To Many Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSetPortToManyHosts = createMutationHook({
    endpoint: SetPortToManyHostsCommand.TSQ_url,
    bodySchema: SetPortToManyHostsCommand.RequestSchema,
    responseSchema: SetPortToManyHostsCommand.ResponseSchema,
    requestMethod: SetPortToManyHostsCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Hosts port set successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Set Port To Many Hosts`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
