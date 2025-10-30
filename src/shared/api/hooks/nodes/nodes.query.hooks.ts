import {
    GetAllNodesCommand,
    GetNodesRealtimeUsageCommand,
    GetNodesUsageByRangeCommand,
    GetNodeUserUsageByRangeCommand,
    GetOneNodeCommand,
    GetPubKeyCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const nodesQueryKeys = createQueryKeys('nodes', {
    getAllNodes: {
        queryKey: null
    },
    getNode: (route: GetOneNodeCommand.Request) => ({
        queryKey: [route]
    }),
    getPubKey: {
        queryKey: null
    },
    getNodesUsageByRangeCommand: (filters: GetNodesUsageByRangeCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getNodeUserUsage: (
        query: GetNodeUserUsageByRangeCommand.Request & GetNodeUserUsageByRangeCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getNodeUserUsageByRange: {
        queryKey: null
    }
})

export const useGetNodes = createGetQueryHook({
    endpoint: GetAllNodesCommand.TSQ_url,
    responseSchema: GetAllNodesCommand.ResponseSchema,
    getQueryKey: () => nodesQueryKeys.getAllNodes.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get All Nodes')
})

export const useGetNode = createGetQueryHook({
    endpoint: GetOneNodeCommand.TSQ_url,
    responseSchema: GetOneNodeCommand.ResponseSchema,
    routeParamsSchema: GetOneNodeCommand.RequestSchema,
    getQueryKey: ({ route }) => nodesQueryKeys.getNode(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5),
        refetchInterval: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node')
})
export const useGetPubKey = createGetQueryHook({
    endpoint: GetPubKeyCommand.TSQ_url,
    responseSchema: GetPubKeyCommand.ResponseSchema,
    getQueryKey: () => nodesQueryKeys.getPubKey.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        staleTime: sToMs(5),
        refetchInterval: sToMs(5)
    },

    errorHandler: (error) => errorHandler(error, 'Get PubKey')
})

export const useGetNodesUsageByRangeCommand = createGetQueryHook({
    endpoint: GetNodesUsageByRangeCommand.TSQ_url,
    responseSchema: GetNodesUsageByRangeCommand.ResponseSchema,
    requestQuerySchema: GetNodesUsageByRangeCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => nodesQueryKeys.getNodesUsageByRangeCommand(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Usage By Range')
})

export const useGetNodeUsersUsageByRange = createGetQueryHook({
    endpoint: GetNodeUserUsageByRangeCommand.TSQ_url,
    responseSchema: GetNodeUserUsageByRangeCommand.ResponseSchema,
    requestQuerySchema: GetNodeUserUsageByRangeCommand.RequestQuerySchema,
    routeParamsSchema: GetNodeUserUsageByRangeCommand.RequestSchema,
    getQueryKey: ({ route, query }) =>
        nodesQueryKeys.getNodeUserUsage({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Users Usage By Range')
})

export const useGetNodesRealtimeUsage = createGetQueryHook({
    endpoint: GetNodesRealtimeUsageCommand.TSQ_url,
    responseSchema: GetNodesRealtimeUsageCommand.ResponseSchema,
    getQueryKey: () => nodesQueryKeys.getNodeUserUsageByRange.queryKey,
    rQueryParams: {
        staleTime: sToMs(5),
        refetchInterval: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Realtime Usage')
})
