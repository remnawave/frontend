import { GetAllHostsCommand, GetAllHostTagsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

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
    errorHandler: (error) => errorHandler(error, 'Get All Hosts')
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
    errorHandler: (error) => errorHandler(error, 'Get All Host Tags')
})
