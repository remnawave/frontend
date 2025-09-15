import {
    GetAllHwidDevicesCommand,
    GetHwidDevicesStatsCommand,
    GetUserHwidDevicesCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '@shared/api/tsq-helpers'
import { sToMs } from '@shared/utils/time-utils'

export const hwidUserDevicesQueryKeys = createQueryKeys('hwid-user-devices', {
    getUserHwidDevices: (route: GetUserHwidDevicesCommand.Request) => ({
        queryKey: [route]
    }),
    getAllHwidDevices: (filters: GetAllHwidDevicesCommand.RequestQuery) => ({
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
    errorHandler: (error) => {
        notifications.show({
            title: 'Get User HWIDs and Devices',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get All HWIDs`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get HWIDs Devices Stats`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
