import { GetNodePluginCommand, GetNodePluginsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const nodePluginsQueryKeys = createQueryKeys('nodePlugins', {
    getNodePlugin: (route: GetNodePluginCommand.Request) => ({
        queryKey: [route]
    }),
    getNodePlugins: {
        queryKey: null
    }
})

export const useGetNodePlugin = createGetQueryHook({
    endpoint: GetNodePluginCommand.TSQ_url,
    routeParamsSchema: GetNodePluginCommand.RequestSchema,
    responseSchema: GetNodePluginCommand.ResponseSchema,
    getQueryKey: ({ route }) => nodePluginsQueryKeys.getNodePlugin(route!).queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Plugin')
})

export const useGetNodePlugins = createGetQueryHook({
    endpoint: GetNodePluginsCommand.TSQ_url,
    responseSchema: GetNodePluginsCommand.ResponseSchema,
    getQueryKey: () => nodePluginsQueryKeys.getNodePlugins.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get Node Plugins')
})
