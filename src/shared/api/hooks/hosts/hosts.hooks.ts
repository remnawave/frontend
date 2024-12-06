import {
    CreateHostCommand,
    DeleteHostCommand,
    GetAllHostsCommand,
    ReorderHostCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { createQueryKeyStore } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'
import { all } from 'axios'

import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'

import {
    createDeleteMutationHook,
    createGetQueryHook,
    createPostMutationHook
} from '../../tsq-helpers'

export const HOSTS_QUERY_KEY = 'hosts'
const STALE_TIME = sToMs(5)
const REFETCH_INTERVAL = sToMs(5.1)

export const queries = createQueryKeyStore({
    hosts: {
        all: null,
        list: null,
        detail: (id: string) => ({
            queryKey: [id]
        }),
        settings: null
    }
})

export const useInvalidateHostsTSQ = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: [HOSTS_QUERY_KEY] })
}

export const useGetHosts = createGetQueryHook({
    endpoint: GetAllHostsCommand.TSQ_url,
    responseSchema: GetAllHostsCommand.ResponseSchema,
    rQueryParams: {
        queryKey: queries.hosts.all.queryKey,
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetAllHostsCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [HOSTS_QUERY_KEY] })
        },
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
