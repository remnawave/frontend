import { GetInboundsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { getUserTimezoneUtil, sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

const STALE_TIME = sToMs(30)
const REFETCH_INTERVAL = sToMs(30.1)

export const inboundsQueryKeys = createQueryKeys('inbounds', {
    getInbounds: {
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
            title: `${GetInboundsCommand.TSQ_url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
