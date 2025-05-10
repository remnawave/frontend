import { GetFullInboundsCommand, GetInboundsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { getUserTimezoneUtil, sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

const STALE_TIME = sToMs(20)
const REFETCH_INTERVAL = sToMs(20.1)

export const inboundsQueryKeys = createQueryKeys('inbounds', {
    getInbounds: {
        queryKey: null
    },
    getFullInbounds: {
        queryKey: null
    }
})

export const useGetInbounds = createGetQueryHook({
    endpoint: GetInboundsCommand.TSQ_url,
    responseSchema: GetInboundsCommand.ResponseSchema,
    getQueryKey: () => inboundsQueryKeys.getInbounds.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Inbounds`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetFullInbounds = createGetQueryHook({
    endpoint: GetFullInboundsCommand.TSQ_url,
    responseSchema: GetFullInboundsCommand.ResponseSchema,
    getQueryKey: () => inboundsQueryKeys.getFullInbounds.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME,
        refetchInterval: REFETCH_INTERVAL
    },
    queryParams: {
        tz: getUserTimezoneUtil()
    },
    errorHandler: (error) => {
        notifications.show({
            title: 'Get Full Inbounds',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
