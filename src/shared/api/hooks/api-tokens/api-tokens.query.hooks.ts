import { FindAllApiTokensCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const apiTokensQueryKeys = createQueryKeys('apiTokens', {
    getAllApiTokens: {
        queryKey: null
    }
})

export const useGetApiTokens = createGetQueryHook({
    endpoint: FindAllApiTokensCommand.TSQ_url,
    responseSchema: FindAllApiTokensCommand.ResponseSchema,
    getQueryKey: () => apiTokensQueryKeys.getAllApiTokens.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get All Api Tokens')
})
