import {
    GetSubscriptionTemplateCommand,
    GetSubscriptionTemplatesCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

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
    errorHandler: (error) => {
        notifications.show({
            title: 'Get Subscription Template',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetSubscriptionTemplates = createGetQueryHook({
    endpoint: GetSubscriptionTemplatesCommand.TSQ_url,
    responseSchema: GetSubscriptionTemplatesCommand.ResponseSchema,
    getQueryKey: () => subscriptionTemplateQueryKeys.getSubscriptionTemplates.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => {
        notifications.show({
            title: 'Get Subscription Templates',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
