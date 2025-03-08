import { GetSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const subscriptionTemplateQueryKeys = createQueryKeys('subscription-template', {
    getSubscriptionTemplate: (route: GetSubscriptionTemplateCommand.Request) => ({
        queryKey: [route]
    })
})

export const useGetSubscriptionTemplate = createGetQueryHook({
    endpoint: GetSubscriptionTemplateCommand.TSQ_url,
    routeParamsSchema: GetSubscriptionTemplateCommand.RequestSchema,
    responseSchema: GetSubscriptionTemplateCommand.ResponseSchema,
    getQueryKey: ({ route }) =>
        subscriptionTemplateQueryKeys.getSubscriptionTemplate(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetSubscriptionTemplateCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
