import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetNodeIntegrationCommand, GetNodeIntegrationsCommand } from '@remnawave/backend-contract'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const nodeIntegrationsQueryKeys = createQueryKeys('nodeIntegrations', {
    getNodeIntegration: (route: GetNodeIntegrationCommand.RequestParam) => ({
        queryKey: [route]
    }),
    getNodeIntegrations: {
        queryKey: null
    }
})

export const useGetNodeIntegration = createGetQueryHook({
    endpoint: GetNodeIntegrationCommand.TSQ_url,
    routeParamsSchema: GetNodeIntegrationCommand.RequestParamSchema,
    responseSchema: GetNodeIntegrationCommand.ResponseSchema,
    getQueryKey: ({ route }) => nodeIntegrationsQueryKeys.getNodeIntegration(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Integration')
})

export const useGetNodeIntegrations = createGetQueryHook({
    endpoint: GetNodeIntegrationsCommand.TSQ_url,
    responseSchema: GetNodeIntegrationsCommand.ResponseSchema,
    getQueryKey: () => nodeIntegrationsQueryKeys.getNodeIntegrations.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Integrations')
})
