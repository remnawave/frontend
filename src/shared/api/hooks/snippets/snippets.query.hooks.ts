import { GetSnippetsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const snippetsQueryKeys = createQueryKeys('snippets', {
    getSnippets: {
        queryKey: null
    }
})

export const useGetSnippets = createGetQueryHook({
    endpoint: GetSnippetsCommand.TSQ_url,
    responseSchema: GetSnippetsCommand.ResponseSchema,
    getQueryKey: () => snippetsQueryKeys.getSnippets.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get All Snippets')
})
