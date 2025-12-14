import {
    GetSubscriptionPageConfigCommand,
    GetSubscriptionPageConfigsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const subpageConfigsQueryKeys = createQueryKeys('subpageConfigs', {
    getSubscriptionPageConfig: (route: GetSubscriptionPageConfigCommand.Request) => ({
        queryKey: [route]
    }),
    getSubscriptionPageConfigs: {
        queryKey: null
    }
})

export const useGetSubscriptionPageConfig = createGetQueryHook({
    endpoint: GetSubscriptionPageConfigCommand.TSQ_url,
    routeParamsSchema: GetSubscriptionPageConfigCommand.RequestSchema,
    responseSchema: GetSubscriptionPageConfigCommand.ResponseSchema,
    getQueryKey: ({ route }) => subpageConfigsQueryKeys.getSubscriptionPageConfig(route!).queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Page Config')
})

export const useGetSubscriptionPageConfigs = createGetQueryHook({
    endpoint: GetSubscriptionPageConfigsCommand.TSQ_url,
    responseSchema: GetSubscriptionPageConfigsCommand.ResponseSchema,
    getQueryKey: () => subpageConfigsQueryKeys.getSubscriptionPageConfigs.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Page Configs')
})
