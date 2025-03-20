import {
    GetAllUsersV2Command,
    GetSubscriptionInfoByShortUuidCommand,
    GetUserByUuidCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '@shared/api/tsq-helpers'
import { sToMs } from '@shared/utils/time-utils'

export const usersQueryKeys = createQueryKeys('users', {
    getAllUsers: (filters: GetAllUsersV2Command.RequestQuery) => ({
        queryKey: [filters]
    }),
    getUserByUuid: (route: GetUserByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getSubscriptionInfoByShortUuid: (route: GetSubscriptionInfoByShortUuidCommand.Request) => ({
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
    errorHandler: (error) => {
        notifications.show({
            title: `${GetUserByUuidCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetUsersV2 = createGetQueryHook({
    endpoint: GetAllUsersV2Command.TSQ_url,
    responseSchema: GetAllUsersV2Command.ResponseSchema,
    requestQuerySchema: GetAllUsersV2Command.RequestQuerySchema,
    getQueryKey: ({ query }) => usersQueryKeys.getAllUsers(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetAllUsersV2Command.url}`,
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
            title: `${GetSubscriptionInfoByShortUuidCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
