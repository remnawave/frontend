import {
    GetLegacyStatsNodeUserUsageCommand,
    GetLegacyStatsUserUsageCommand,
    GetStatsNodesRealtimeUsageCommand,
    GetStatsNodesUsageCommand,
    GetStatsNodeUsersUsageCommand,
    GetStatsUserUsageCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const bandwidthStatsQueryKeys = createQueryKeys('bandwidthStats', {
    getStatsNodesRealtimeUsageCommand: {
        queryKey: null
    },
    getStatsNodesUsageCommand: (filters: GetStatsNodesUsageCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getStatsUserUsageCommand: (
        query: GetStatsUserUsageCommand.Request & GetStatsUserUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getStatsNodeUsersUsageCommand: (
        query: GetStatsNodeUsersUsageCommand.Request & GetStatsNodeUsersUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getLegacyStatsUserUsageCommand: (
        query: GetLegacyStatsUserUsageCommand.Request & GetLegacyStatsUserUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getLegacyStatsNodeUserUsageCommand: (
        query: GetLegacyStatsNodeUserUsageCommand.Request &
            GetLegacyStatsNodeUserUsageCommand.RequestQuery
    ) => ({
        queryKey: [query]
    })
})

export const useGetStatsNodesRealtimeUsage = createGetQueryHook({
    endpoint: GetStatsNodesRealtimeUsageCommand.TSQ_url,
    responseSchema: GetStatsNodesRealtimeUsageCommand.ResponseSchema,
    getQueryKey: () => bandwidthStatsQueryKeys.getStatsNodesRealtimeUsageCommand.queryKey,
    rQueryParams: {
        staleTime: sToMs(5),
        refetchInterval: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Realtime Usage')
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
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getStatsNodeUsersUsageCommand({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Users Usage By Range')
})

export const useGetLegacyStatsNodeUserUsage = createGetQueryHook({
    endpoint: GetLegacyStatsNodeUserUsageCommand.TSQ_url,
    responseSchema: GetLegacyStatsNodeUserUsageCommand.ResponseSchema,
    requestQuerySchema: GetLegacyStatsNodeUserUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetLegacyStatsNodeUserUsageCommand.RequestSchema,
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getLegacyStatsNodeUserUsageCommand({ ...route!, ...query! })
            .queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Users Usage By Range')
})

export const useGetLegacyStatsUserUsage = createGetQueryHook({
    endpoint: GetLegacyStatsUserUsageCommand.TSQ_url,
    responseSchema: GetLegacyStatsUserUsageCommand.ResponseSchema,
    requestQuerySchema: GetLegacyStatsUserUsageCommand.RequestQuerySchema,
    routeParamsSchema: GetLegacyStatsUserUsageCommand.RequestSchema,
    getQueryKey: ({ route, query }) =>
        bandwidthStatsQueryKeys.getLegacyStatsUserUsageCommand({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get User Usage By Range')
})
