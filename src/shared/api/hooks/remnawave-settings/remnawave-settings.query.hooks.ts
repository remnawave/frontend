import { GetRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const remnawaveSettingsQueryKeys = createQueryKeys('remnawaveSettings', {
    getRemnawaveSettings: {
        queryKey: null
    }
})

export const useGetRemnawaveSettings = createGetQueryHook({
    endpoint: GetRemnawaveSettingsCommand.TSQ_url,
    responseSchema: GetRemnawaveSettingsCommand.ResponseSchema,
    getQueryKey: () => remnawaveSettingsQueryKeys.getRemnawaveSettings.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Remnawave Settings')
})
