import {
    GetBandwidthStatsCommand,
    GetNodesMetricsCommand,
    GetNodesStatisticsCommand,
    GetRemnawaveHealthCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { getUserTimezoneUtil, sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

const STALE_TIME = 5_000
const REFETCH_INTERVAL = 5_100

export const systemQueryKeys = createQueryKeys('system', {
    getSystemStats: {
        queryKey: null
    },
    getBandwidthStats: {
        queryKey: null
    },
    getNodesStatistics: {
        queryKey: null
    },
    getRemnawaveHealth: {
        queryKey: null
    },
    getNodesMetrics: {
        queryKey: null
    }
})

export const useGetSystemStats = createGetQueryHook({
    endpoint: GetStatsCommand.TSQ_url,
    responseSchema: GetStatsCommand.ResponseSchema,
    requestQuerySchema: GetStatsCommand.RequestQuerySchema,
    getQueryKey: () => systemQueryKeys.getSystemStats.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => errorHandler(error, 'Get System Stats')
})

export const useGetBandwidthStats = createGetQueryHook({
    endpoint: GetBandwidthStatsCommand.TSQ_url,
    responseSchema: GetBandwidthStatsCommand.ResponseSchema,
    requestQuerySchema: GetBandwidthStatsCommand.RequestQuerySchema,
    getQueryKey: () => systemQueryKeys.getBandwidthStats.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => errorHandler(error, 'Get Bandwidth Stats')
})

export const useGetNodesStatisticsCommand = createGetQueryHook({
    endpoint: GetNodesStatisticsCommand.TSQ_url,
    responseSchema: GetNodesStatisticsCommand.ResponseSchema,
    requestQuerySchema: GetNodesStatisticsCommand.RequestQuerySchema,
    getQueryKey: () => systemQueryKeys.getNodesStatistics.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: sToMs(30),
        refetchInterval: sToMs(30)
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Statistics')
})

export const useGetRemnawaveHealth = createGetQueryHook({
    endpoint: GetRemnawaveHealthCommand.TSQ_url,
    responseSchema: GetRemnawaveHealthCommand.ResponseSchema,
    getQueryKey: () => systemQueryKeys.getRemnawaveHealth.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: sToMs(10),
        refetchInterval: sToMs(10)
    },
    errorHandler: (error) => errorHandler(error, 'Get Remnawave Health')
})

export const useGetNodesMetrics = createGetQueryHook({
    endpoint: GetNodesMetricsCommand.TSQ_url,
    responseSchema: GetNodesMetricsCommand.ResponseSchema,
    getQueryKey: () => systemQueryKeys.getNodesMetrics.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: sToMs(30),
        refetchInterval: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Nodes Metrics')
})
