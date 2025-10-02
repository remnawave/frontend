import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetStatusCommand } from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const authQueryKeys = createQueryKeys('auth', {
    getAuthStatus: {
        queryKey: null
    }
})

export const useGetAuthStatus = createGetQueryHook({
    endpoint: GetStatusCommand.TSQ_url,
    responseSchema: GetStatusCommand.ResponseSchema,
    getQueryKey: () => authQueryKeys.getAuthStatus.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        placeholderData: keepPreviousData,
        staleTime: sToMs(500)
    },
    errorHandler: (error) => {
        notifications.show({
            title: 'Authentication Error',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
