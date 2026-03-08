import {
    GetNodePluginCommand,
    GetNodePluginsCommand,
    GetTorrentBlockerReportsCommand,
    GetTorrentBlockerReportsStatsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const nodePluginsQueryKeys = createQueryKeys('nodePlugins', {
    getNodePlugin: (route: GetNodePluginCommand.Request) => ({
        queryKey: [route]
    }),
    getNodePlugins: {
        queryKey: null
    },
    getTorrentBlockerReports: (filters: GetTorrentBlockerReportsCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getTorrentBlockerStats: {
        queryKey: null
    }
})

export const useGetNodePlugin = createGetQueryHook({
    endpoint: GetNodePluginCommand.TSQ_url,
    routeParamsSchema: GetNodePluginCommand.RequestSchema,
    responseSchema: GetNodePluginCommand.ResponseSchema,
    getQueryKey: ({ route }) => nodePluginsQueryKeys.getNodePlugin(route!).queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Plugin')
})

export const useGetNodePlugins = createGetQueryHook({
    endpoint: GetNodePluginsCommand.TSQ_url,
    responseSchema: GetNodePluginsCommand.ResponseSchema,
    getQueryKey: () => nodePluginsQueryKeys.getNodePlugins.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Plugins')
})

export const useGetTorrentBlockerReports = createGetQueryHook({
    endpoint: GetTorrentBlockerReportsCommand.TSQ_url,
    responseSchema: GetTorrentBlockerReportsCommand.ResponseSchema,
    requestQuerySchema: GetTorrentBlockerReportsCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => nodePluginsQueryKeys.getTorrentBlockerReports(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get Torrent Blocker Reports')
})

export const useGetTorrentBlockerStats = createGetQueryHook({
    endpoint: GetTorrentBlockerReportsStatsCommand.TSQ_url,
    responseSchema: GetTorrentBlockerReportsStatsCommand.ResponseSchema,
    getQueryKey: () => nodePluginsQueryKeys.getTorrentBlockerStats.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Torrent Blocker Reports Stats')
})
