import {
    GetInfraBillingHistoryRecordsCommand,
    GetInfraBillingNodesCommand,
    GetInfraProviderByUuidCommand,
    GetInfraProvidersCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const infraBillingQueryKeys = createQueryKeys('infraBilling', {
    getInfraProviders: {
        queryKey: null
    },
    getInfraProvider: (route: GetInfraProviderByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getInfraBillingHistoryRecords: (
        filters: GetInfraBillingHistoryRecordsCommand.RequestQuery
    ) => ({
        queryKey: [filters]
    }),
    getInfraBillingNodes: {
        queryKey: null
    }
})

export const useGetInfraProviders = createGetQueryHook({
    endpoint: GetInfraProvidersCommand.TSQ_url,
    responseSchema: GetInfraProvidersCommand.ResponseSchema,
    getQueryKey: () => infraBillingQueryKeys.getInfraProviders.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get All Infra Providers')
})

export const useGetInfraProvider = createGetQueryHook({
    endpoint: GetInfraProviderByUuidCommand.TSQ_url,
    responseSchema: GetInfraProviderByUuidCommand.ResponseSchema,
    routeParamsSchema: GetInfraProviderByUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => infraBillingQueryKeys.getInfraProvider(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30),
        placeholderData: keepPreviousData
    },
    errorHandler: (error) => errorHandler(error, 'Get Infra Provider')
})

export const useGetInfraBillingHistoryRecords = createGetQueryHook({
    endpoint: GetInfraBillingHistoryRecordsCommand.TSQ_url,
    responseSchema: GetInfraBillingHistoryRecordsCommand.ResponseSchema,
    requestQuerySchema: GetInfraBillingHistoryRecordsCommand.RequestQuerySchema,
    getQueryKey: ({ query }) =>
        infraBillingQueryKeys.getInfraBillingHistoryRecords(query!).queryKey,
    rQueryParams: {
        staleTime: sToMs(20),
        refetchInterval: sToMs(60),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => errorHandler(error, 'Get Infra Billing History Records')
})

export const useGetInfraBillingNodes = createGetQueryHook({
    endpoint: GetInfraBillingNodesCommand.TSQ_url,
    responseSchema: GetInfraBillingNodesCommand.ResponseSchema,
    getQueryKey: () => infraBillingQueryKeys.getInfraBillingNodes.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30),
        placeholderData: keepPreviousData
    },
    errorHandler: (error) => errorHandler(error, 'Get All Infra Billing Nodes')
})
