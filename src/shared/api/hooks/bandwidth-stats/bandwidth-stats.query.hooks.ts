import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetStatsNodesUsageCommand,
    GetStatsNodesUsersUsageCommand,
    GetStatsNodeUsersUsageCommand,
    GetStatsUserUsageCommand,
    GetInternalSquadUsageCommand
} from '@remnawave/backend-contract'

import { sToMs } from '@shared/utils/time-utils'

import {
    createBodyQueryHook,
    createGetInfiniteQueryHook,
    createGetQueryHook,
    errorHandler
} from '../../tsq-helpers'

export const bandwidthStatsQueryKeys = createQueryKeys('bandwidthStats', {
    getStatsNodesUsageCommand: (filters: GetStatsNodesUsageCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getStatsUserUsageCommand: (
        query: GetStatsUserUsageCommand.RequestParam & GetStatsUserUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getStatsNodeUsersUsageCommand: (
        query: GetStatsNodeUsersUsageCommand.RequestParam &
            GetStatsNodeUsersUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getStatsNodesUsersUsageCommand: (
        params: GetStatsNodesUsersUsageCommand.RequestBody &
            GetStatsNodesUsersUsageCommand.RequestQuery
    ) => ({
        queryKey: [params]
    }),
    getInternalSquadUsageCommand: (
        params: GetInternalSquadUsageCommand.RequestParam &
            GetInternalSquadUsageCommand.RequestQuery
    ) => ({
        queryKey: [params]
    })
})

export const useGetStatsNodesUsage = createGetQueryHook({
    endpoint: GetStatsNodesUsageCommand.TSQ_url,
    responseSchema: GetStatsNodesUsageCommand.ResponseSchema,
    requestQuerySchema: GetStatsNodesUsageCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => bandwidthStatsQueryKeys.getStatsNodesUsageCommand(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Usage By Range')
})

export const useGetStatsUserUsage = createGetQueryHook({
    endpoint: GetStatsUserUsageCommand.TSQ_url,
    responseSchema: GetStatsUserUsageCommand.ResponseSchema,
    requestQuerySchema: GetStatsUserUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetStatsUserUsageCommand.RequestParamSchema,
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getStatsUserUsageCommand({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get User Usage By Range')
})

export const useGetStatsNodeUsersUsage = createGetQueryHook({
    endpoint: GetStatsNodeUsersUsageCommand.TSQ_url,
    responseSchema: GetStatsNodeUsersUsageCommand.ResponseSchema,
    requestQuerySchema: GetStatsNodeUsersUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetStatsNodeUsersUsageCommand.RequestParamSchema,
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getStatsNodeUsersUsageCommand({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Users Usage By Range')
})

export const useGetStatsNodesUsersUsage = createBodyQueryHook({
    endpoint: GetStatsNodesUsersUsageCommand.TSQ_url,
    requestMethod: GetStatsNodesUsersUsageCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: GetStatsNodesUsersUsageCommand.ResponseSchema,
    requestQuerySchema: GetStatsNodesUsersUsageCommand.RequestQuerySchema,
    bodySchema: GetStatsNodesUsersUsageCommand.RequestBodySchema,
    getQueryKey: ({ query, body }) =>
        bandwidthStatsQueryKeys.getStatsNodesUsersUsageCommand({ ...query!, ...body! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Users Usage By Range')
})

export const useGetInternalSquadUsage = createGetQueryHook({
    endpoint: GetInternalSquadUsageCommand.TSQ_url,
    responseSchema: GetInternalSquadUsageCommand.ResponseSchema,
    requestQuerySchema: GetInternalSquadUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetInternalSquadUsageCommand.RequestParamSchema,
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getInternalSquadUsageCommand({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Internal Squad Users Usage By Range')
})

export const useGetInternalSquadUsageInfinite = createGetInfiniteQueryHook({
    endpoint: GetInternalSquadUsageCommand.TSQ_url,
    responseSchema: GetInternalSquadUsageCommand.ResponseSchema,
    requestQuerySchema: GetInternalSquadUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetInternalSquadUsageCommand.RequestParamSchema,
    getQueryKey: ({ route, query }) => [
        ...bandwidthStatsQueryKeys.getInternalSquadUsageCommand({ ...route!, ...query! }).queryKey,
        'infinite'
    ],
    pageParamKey: 'cursor',
    initialPageParam: null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : null),
    rQueryParams: {
        staleTime: sToMs(60),
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get Internal Squad Usage (infinite)')
})
