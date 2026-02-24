import { FetchIpsResultCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const ipControlQueryKeys = createQueryKeys('ipControl', {
    fetchUserIpsResult: (route: FetchIpsResultCommand.Request) => ({
        queryKey: [route]
    })
})

export const useFetchIpsResult = createGetQueryHook({
    endpoint: FetchIpsResultCommand.TSQ_url,
    responseSchema: FetchIpsResultCommand.ResponseSchema,
    routeParamsSchema: FetchIpsResultCommand.RequestSchema,
    getQueryKey: ({ route, query }) =>
        ipControlQueryKeys.fetchUserIpsResult({ ...route!, ...query! }).queryKey,
    rQueryParams: {
        staleTime: sToMs(60)
    },
    errorHandler: (error) => errorHandler(error, 'Fetch User IPs Result')
})
