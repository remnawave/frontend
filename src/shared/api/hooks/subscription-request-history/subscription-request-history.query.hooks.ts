import {
    GetSubscriptionRequestHistoryCommand,
    GetSubscriptionRequestHistoryStatsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '@shared/api/tsq-helpers'
import { sToMs } from '@shared/utils/time-utils'

export const subscriptionRequestHistoryQueryKeys = createQueryKeys('subscriptionRequestHistory', {
    getSubscriptionRequestHistory: (
        filters: GetSubscriptionRequestHistoryCommand.RequestQuery
    ) => ({
        queryKey: [filters]
    }),
    getSubscriptionRequestHistoryStats: {
        queryKey: null
    }
})

const STALE_TIME = 15_000
const REFETCH_INTERVAL = 15_100

export const useGetSubscriptionRequestHistory = createGetQueryHook({
    endpoint: GetSubscriptionRequestHistoryCommand.TSQ_url,
    responseSchema: GetSubscriptionRequestHistoryCommand.ResponseSchema,
    requestQuerySchema: GetSubscriptionRequestHistoryCommand.RequestQuerySchema,
    getQueryKey: ({ query }) =>
        subscriptionRequestHistoryQueryKeys.getSubscriptionRequestHistory(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Subscription Request History`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetSubscriptionRequestHistoryStats = createGetQueryHook({
    endpoint: GetSubscriptionRequestHistoryStatsCommand.TSQ_url,
    responseSchema: GetSubscriptionRequestHistoryStatsCommand.ResponseSchema,
    getQueryKey: () =>
        subscriptionRequestHistoryQueryKeys.getSubscriptionRequestHistoryStats.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Subscription Request History Stats`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
