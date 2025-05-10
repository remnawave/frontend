import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

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
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Subscription Settings`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
