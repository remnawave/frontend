import {
    GetInfraBillingHistoryRecordsCommand,
    GetInfraBillingNodesCommand,
    GetInfraProviderByUuidCommand,
    GetInfraProvidersCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

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
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Infra Providers`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get Infra Provider`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get Infra Billing History Records`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Infra Billing Nodes`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
