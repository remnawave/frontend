import { GetInboundsCommand } from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { getUserTimezoneUtil, sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const INBOUNDS_QUERY_KEY = 'inbounds'

const STALE_TIME = sToMs(30)
const REFETCH_INTERVAL = sToMs(30.1)

export const useGetInbounds = createGetQueryHook({
    endpoint: GetInboundsCommand.TSQ_url,
    responseSchema: GetInboundsCommand.ResponseSchema,
    rQueryParams: {
        queryKey: [INBOUNDS_QUERY_KEY, { command: GetInboundsCommand.TSQ_url }],
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
