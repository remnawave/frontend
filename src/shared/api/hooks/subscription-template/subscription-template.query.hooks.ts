import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetSubscriptionTemplateCommand,
    GetSubscriptionTemplatesCommand,
    GetSubscriptionTemplatesTagsCommand
} from '@remnawave/backend-contract'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const subscriptionTemplateQueryKeys = createQueryKeys('subscriptionTemplate', {
    getSubscriptionTemplatesTags: {
        queryKey: null
    },
    getSubscriptionTemplate: (route: GetSubscriptionTemplateCommand.RequestParam) => ({
        queryKey: [route]
    }),
    getSubscriptionTemplates: {
        queryKey: null
    }
})

export const useGetSubscriptionTemplate = createGetQueryHook({
    endpoint: GetSubscriptionTemplateCommand.TSQ_url,
    routeParamsSchema: GetSubscriptionTemplateCommand.RequestParamSchema,
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

export const useGetSubscriptionTemplatesTags = createGetQueryHook({
    endpoint: GetSubscriptionTemplatesTagsCommand.TSQ_url,
    responseSchema: GetSubscriptionTemplatesTagsCommand.ResponseSchema,
    getQueryKey: () => subscriptionTemplateQueryKeys.getSubscriptionTemplatesTags.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get SubscriptionTemplates Tags')
})
