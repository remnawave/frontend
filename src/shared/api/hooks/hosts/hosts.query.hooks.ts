import { GetAllHostsCommand, GetAllHostTagsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const hostsQueryKeys = createQueryKeys('hosts', {
    getAllHosts: {
        queryKey: null
    },
    getAllTags: {
        queryKey: null
    }
})

export const useGetHosts = createGetQueryHook({
    endpoint: GetAllHostsCommand.TSQ_url,
    responseSchema: GetAllHostsCommand.ResponseSchema,
    getQueryKey: () => hostsQueryKeys.getAllHosts.queryKey,
    rQueryParams: {
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Hosts`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetHostTags = createGetQueryHook({
    endpoint: GetAllHostTagsCommand.TSQ_url,
    responseSchema: GetAllHostTagsCommand.ResponseSchema,
    getQueryKey: () => hostsQueryKeys.getAllTags.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(60),
        refetchInterval: sToMs(60),
        placeholderData: false
    },

    errorHandler: (error) => {
        notifications.show({
            title: `Get All Host Tags`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
