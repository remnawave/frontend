import {
    GetSubscriptionTemplateCommand,
    GetSubscriptionTemplatesCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const subscriptionTemplateQueryKeys = createQueryKeys('subscriptionTemplate', {
    getSubscriptionTemplate: (route: GetSubscriptionTemplateCommand.Request) => ({
        queryKey: [route]
    }),
    getSubscriptionTemplates: {
        queryKey: null
    }
})

export const useGetSubscriptionTemplate = createGetQueryHook({
    endpoint: GetSubscriptionTemplateCommand.TSQ_url,
    routeParamsSchema: GetSubscriptionTemplateCommand.RequestSchema,
    responseSchema: GetSubscriptionTemplateCommand.ResponseSchema,
    getQueryKey: ({ route }) =>
        subscriptionTemplateQueryKeys.getSubscriptionTemplate(route!).queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Template')
})

export const useGetSubscriptionTemplates = createGetQueryHook({
    endpoint: GetSubscriptionTemplatesCommand.TSQ_url,
    responseSchema: GetSubscriptionTemplatesCommand.ResponseSchema,
    getQueryKey: () => subscriptionTemplateQueryKeys.getSubscriptionTemplates.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Subscription Templates')
})
