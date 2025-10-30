import {
    GetPasskeyAuthenticationOptionsCommand,
    GetStatusCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const authQueryKeys = createQueryKeys('auth', {
    getAuthStatus: {
        queryKey: null
    },
    getPasskeyAuthenticationOptions: {
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
    errorHandler: (error) => errorHandler(error, 'Authentication Error')
})

export const usePasskeyAuthenticationOptions = createGetQueryHook({
    endpoint: GetPasskeyAuthenticationOptionsCommand.TSQ_url,
    responseSchema: GetPasskeyAuthenticationOptionsCommand.ResponseSchema,
    getQueryKey: () => authQueryKeys.getPasskeyAuthenticationOptions.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Authentication Error')
})
