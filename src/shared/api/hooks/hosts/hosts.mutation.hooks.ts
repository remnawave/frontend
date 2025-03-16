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

export const useBulkDeleteHosts = createPostMutationHook({
    endpoint: BulkDeleteHostsCommand.TSQ_url,
    bodySchema: BulkDeleteHostsCommand.RequestSchema,
    responseSchema: BulkDeleteHostsCommand.ResponseSchema,
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
                title: `${BulkDeleteHostsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkEnableHosts = createPostMutationHook({
    endpoint: BulkEnableHostsCommand.TSQ_url,
    bodySchema: BulkEnableHostsCommand.RequestSchema,
    responseSchema: BulkEnableHostsCommand.ResponseSchema,
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
                title: `${BulkEnableHostsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkDisableHosts = createPostMutationHook({
    endpoint: BulkDisableHostsCommand.TSQ_url,
    bodySchema: BulkDisableHostsCommand.RequestSchema,
    responseSchema: BulkDisableHostsCommand.ResponseSchema,
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
                title: `${BulkDisableHostsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSetInboundHosts = createPostMutationHook({
    endpoint: SetInboundToManyHostsCommand.TSQ_url,
    bodySchema: SetInboundToManyHostsCommand.RequestSchema,
    responseSchema: SetInboundToManyHostsCommand.ResponseSchema,
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
                title: `${SetInboundToManyHostsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useSetPortToManyHosts = createPostMutationHook({
    endpoint: SetPortToManyHostsCommand.TSQ_url,
    bodySchema: SetPortToManyHostsCommand.RequestSchema,
    responseSchema: SetPortToManyHostsCommand.ResponseSchema,
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
                title: `${SetPortToManyHostsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
