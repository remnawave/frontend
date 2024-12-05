import {
    GetBandwidthStatsCommand,
    GetNodesStatisticsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { getUserTimezoneUtil, sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const SYSTEM_QUERY_KEY = 'system'
export const SYSTEM_STALE_TIME = 5_000
export const SYSTEM_REFETCH_INTERVAL = 5_100

export const useGetSystemStats = createGetQueryHook({
    endpoint: GetStatsCommand.TSQ_url,
    responseSchema: GetStatsCommand.ResponseSchema,
    requestQuerySchema: GetStatsCommand.RequestQuerySchema,
    rQueryParams: {
        queryKey: [SYSTEM_QUERY_KEY, { command: GetStatsCommand.TSQ_url }],
        placeholderData: keepPreviousData,
        staleTime: SYSTEM_STALE_TIME,
        refetchInterval: SYSTEM_REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetStatsCommand.TSQ_url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetBandwidthStats = createGetQueryHook({
    endpoint: GetBandwidthStatsCommand.TSQ_url,
    responseSchema: GetBandwidthStatsCommand.ResponseSchema,
    requestQuerySchema: GetBandwidthStatsCommand.RequestQuerySchema,
    rQueryParams: {
        queryKey: [SYSTEM_QUERY_KEY, { command: GetBandwidthStatsCommand.TSQ_url }],
        placeholderData: keepPreviousData,
        staleTime: SYSTEM_STALE_TIME,
        refetchInterval: SYSTEM_REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetStatsCommand.TSQ_url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetNodesStatisticsCommand = createGetQueryHook({
    endpoint: GetNodesStatisticsCommand.TSQ_url,
    responseSchema: GetNodesStatisticsCommand.ResponseSchema,
    requestQuerySchema: GetNodesStatisticsCommand.RequestQuerySchema,
    rQueryParams: {
        queryKey: [SYSTEM_QUERY_KEY, { command: GetNodesStatisticsCommand.TSQ_url }],
        placeholderData: keepPreviousData,
        staleTime: sToMs(30),
        refetchInterval: sToMs(30)
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetStatsCommand.TSQ_url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
