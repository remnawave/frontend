import {
    GetAllTagsCommand,
    GetAllUsersCommand,
    GetSubscriptionByUuidCommand,
    GetUserAccessibleNodesCommand,
    GetUserByUuidCommand,
    GetUserSubscriptionRequestHistoryCommand,
    GetUserUsageByRangeCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const usersQueryKeys = createQueryKeys('users', {
    getAllUsers: (filters: GetAllUsersCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getUserByUuid: (route: GetUserByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getSubscriptionByUuid: (route: GetSubscriptionByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getUserUsageByRange: (
        query: GetUserUsageByRangeCommand.Request & GetUserUsageByRangeCommand.RequestQuery
    ) => ({
        queryKey: [query]
    }),
    getUserTags: {
        queryKey: null
    },
    getUserAccessibleNodes: (route: GetUserAccessibleNodesCommand.Request) => ({
        queryKey: [route]
    }),
    getUserSubscriptionRequestHistory: (
        route: GetUserSubscriptionRequestHistoryCommand.Request
    ) => ({
        queryKey: [route]
    })
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
    errorHandler: (error) => errorHandler(error, 'Get User By UUID')
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
    errorHandler: (error) => errorHandler(error, 'Get All Users')
})

export const useGetSubscriptionInfoByUuid = createGetQueryHook({
    endpoint: GetSubscriptionByUuidCommand.TSQ_url,
    responseSchema: GetSubscriptionByUuidCommand.ResponseSchema,
    routeParamsSchema: GetSubscriptionByUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => usersQueryKeys.getSubscriptionByUuid(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(4)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Info By UUID')
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
    errorHandler: (error) => errorHandler(error, 'Get User Usage By Range')
})

export const useGetUserTags = createGetQueryHook({
    endpoint: GetAllTagsCommand.TSQ_url,
    responseSchema: GetAllTagsCommand.ResponseSchema,
    getQueryKey: () => usersQueryKeys.getUserTags.queryKey,
    rQueryParams: {
        staleTime: sToMs(15),
        refetchInterval: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get User Tags')
})

export const useGetUserAccessibleNodes = createGetQueryHook({
    endpoint: GetUserAccessibleNodesCommand.TSQ_url,
    responseSchema: GetUserAccessibleNodesCommand.ResponseSchema,
    routeParamsSchema: GetUserAccessibleNodesCommand.RequestSchema,
    getQueryKey: ({ route }) => usersQueryKeys.getUserAccessibleNodes(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get User Accessible Nodes')
})

export const useGetUserSubscriptionRequestHistory = createGetQueryHook({
    endpoint: GetUserSubscriptionRequestHistoryCommand.TSQ_url,
    responseSchema: GetUserSubscriptionRequestHistoryCommand.ResponseSchema,
    routeParamsSchema: GetUserSubscriptionRequestHistoryCommand.RequestSchema,
    getQueryKey: ({ route }) => usersQueryKeys.getUserSubscriptionRequestHistory(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Get User Subscription Request History')
})
