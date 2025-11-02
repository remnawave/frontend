import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const subscriptionSettingsQueryKeys = createQueryKeys('subscriptionSettings', {
    getSubscriptionSettings: {
        queryKey: null
    }
})

export const useGetSubscriptionSettings = createGetQueryHook({
    endpoint: GetSubscriptionSettingsCommand.TSQ_url,
    responseSchema: GetSubscriptionSettingsCommand.ResponseSchema,
    getQueryKey: () => subscriptionSettingsQueryKeys.getSubscriptionSettings.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Settings')
})
