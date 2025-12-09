import {
    GetAllHwidDevicesCommand,
    GetHwidDevicesStatsCommand,
    GetTopUsersByHwidDevicesCommand,
    GetUserHwidDevicesCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const hwidUserDevicesQueryKeys = createQueryKeys('hwid-user-devices', {
    getUserHwidDevices: (route: GetUserHwidDevicesCommand.Request) => ({
        queryKey: [route]
    }),
    getAllHwidDevices: (filters: GetAllHwidDevicesCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getTopUsersByHwidDevices: (filters: GetTopUsersByHwidDevicesCommand.RequestQuery) => ({
        queryKey: [filters]
    }),
    getHwidDevicesStats: {
        queryKey: null
    }
})

const STALE_TIME = 15_000
const REFETCH_INTERVAL = 15_100

export const useGetUserHwidDevices = createGetQueryHook({
    endpoint: GetUserHwidDevicesCommand.TSQ_url,
    responseSchema: GetUserHwidDevicesCommand.ResponseSchema,
    routeParamsSchema: GetUserHwidDevicesCommand.RequestSchema,
    getQueryKey: ({ route }) => hwidUserDevicesQueryKeys.getUserHwidDevices(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(20)
    },
    errorHandler: (error) => errorHandler(error, 'Get User HWIDs and Devices')
})

export const useGetAllHwidDevices = createGetQueryHook({
    endpoint: GetAllHwidDevicesCommand.TSQ_url,
    responseSchema: GetAllHwidDevicesCommand.ResponseSchema,
    requestQuerySchema: GetAllHwidDevicesCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => hwidUserDevicesQueryKeys.getAllHwidDevices(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get All HWIDs')
})

export const useGetHwidDevicesStats = createGetQueryHook({
    endpoint: GetHwidDevicesStatsCommand.TSQ_url,
    responseSchema: GetHwidDevicesStatsCommand.ResponseSchema,
    getQueryKey: () => hwidUserDevicesQueryKeys.getHwidDevicesStats.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    errorHandler: (error) => errorHandler(error, 'Get HWIDs Devices Stats')
})

export const useGetTopUsersByHwidDevices = createGetQueryHook({
    endpoint: GetTopUsersByHwidDevicesCommand.TSQ_url,
    responseSchema: GetTopUsersByHwidDevicesCommand.ResponseSchema,
    requestQuerySchema: GetTopUsersByHwidDevicesCommand.RequestQuerySchema,
    getQueryKey: ({ query }) => hwidUserDevicesQueryKeys.getTopUsersByHwidDevices(query!).queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    errorHandler: (error) => errorHandler(error, 'Get Top Users by HWIDs Devices')
})
