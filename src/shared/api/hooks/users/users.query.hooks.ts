import {
    GetAllTagsCommand,
    GetAllUsersCommand,
    GetSubscriptionInfoByShortUuidCommand,
    GetUserByUuidCommand,
    GetUserUsageByRangeCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '@shared/api/tsq-helpers'
import { sToMs } from '@shared/utils/time-utils'

export const usersQueryKeys = createQueryKeys('users', {
    getAllUsers: (filters: GetAllUsersCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getUserByUuid: (route: GetUserByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getSubscriptionInfoByShortUuid: (route: GetSubscriptionInfoByShortUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getUserUsageByRange: (
        query: GetUserUsageByRangeCommand.Request & GetUserUsageByRangeCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getUserTags: {
        queryKey: null
    }
})

export const useGetUserByUuid = createGetQueryHook({
    endpoint: GetUserByUuidCommand.TSQ_url,
    responseSchema: GetUserByUuidCommand.ResponseSchema,
    routeParamsSchema: GetUserByUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => usersQueryKeys.getUserByUuid(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(3),
        refetchInterval: sToMs(35)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get User By UUID`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetUsersV2 = createGetQueryHook({
    endpoint: GetAllUsersCommand.TSQ_url,
    responseSchema: GetAllUsersCommand.ResponseSchema,
    requestQuerySchema: GetAllUsersCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => usersQueryKeys.getAllUsers(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Users`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetSubscriptionInfoByShortUuid = createGetQueryHook({
    endpoint: GetSubscriptionInfoByShortUuidCommand.TSQ_url,
    responseSchema: GetSubscriptionInfoByShortUuidCommand.ResponseSchema,
    routeParamsSchema: GetSubscriptionInfoByShortUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => usersQueryKeys.getSubscriptionInfoByShortUuid(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(40)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Subscription Info By Short UUID`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetUserUsageByRange = createGetQueryHook({
    endpoint: GetUserUsageByRangeCommand.TSQ_url,
    responseSchema: GetUserUsageByRangeCommand.ResponseSchema,
    requestQuerySchema: GetUserUsageByRangeCommand.RequestQuerySchema,
    routeParamsSchema: GetUserUsageByRangeCommand.RequestSchema,
    getQueryKey: ({ route, query }) =>
        usersQueryKeys.getUserUsageByRange({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(15)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get User Usage By Range`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetUserTags = createGetQueryHook({
    endpoint: GetAllTagsCommand.TSQ_url,
    responseSchema: GetAllTagsCommand.ResponseSchema,
    getQueryKey: () => usersQueryKeys.getUserTags.queryKey,
    rQueryParams: {
        staleTime: sToMs(15),
        refetchInterval: sToMs(15)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get User Tags`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
