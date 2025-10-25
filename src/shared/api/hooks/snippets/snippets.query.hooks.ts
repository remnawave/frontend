import { GetSnippetsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

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
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Snippets`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
