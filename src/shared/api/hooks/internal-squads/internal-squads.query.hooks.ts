import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetInternalSquadAccessibleNodesCommand,
    GetInternalSquadCommand,
    GetInternalSquadsCommand,
    GetInternalSquadsTagsCommand
} from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const internalSquadsQueryKeys = createQueryKeys('internalSquads', {
    getInternalSquadsTags: {
        queryKey: null
    },
    getInternalSquads: {
        queryKey: null
    },
    getInternalSquad: (route: GetInternalSquadCommand.RequestParam) => ({
        queryKey: [route]
    }),
    getInternalSquadAccessibleNodes: (
        route: GetInternalSquadAccessibleNodesCommand.RequestParam
    ) => ({
        queryKey: [route]
    })
})

export const useGetInternalSquads = createGetQueryHook({
    endpoint: GetInternalSquadsCommand.TSQ_url,
    responseSchema: GetInternalSquadsCommand.ResponseSchema,
    getQueryKey: () => internalSquadsQueryKeys.getInternalSquads.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        staleTime: sToMs(5)
    },

    errorHandler: (error) => errorHandler(error, 'Get All Internal Squads')
})

export const useGetInternalSquad = createGetQueryHook({
    endpoint: GetInternalSquadCommand.TSQ_url,
    responseSchema: GetInternalSquadCommand.ResponseSchema,
    routeParamsSchema: GetInternalSquadCommand.RequestParamSchema,
    getQueryKey: ({ route }) => internalSquadsQueryKeys.getInternalSquad(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Internal Squad')
})

export const useGetInternalSquadAccessibleNodes = createGetQueryHook({
    endpoint: GetInternalSquadAccessibleNodesCommand.TSQ_url,
    responseSchema: GetInternalSquadAccessibleNodesCommand.ResponseSchema,
    routeParamsSchema: GetInternalSquadAccessibleNodesCommand.RequestParamSchema,
    getQueryKey: ({ route }) =>
        internalSquadsQueryKeys.getInternalSquadAccessibleNodes(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get Internal Squad Accessible Nodes')
})

export const useGetInternalSquadsTags = createGetQueryHook({
    endpoint: GetInternalSquadsTagsCommand.TSQ_url,
    responseSchema: GetInternalSquadsTagsCommand.ResponseSchema,
    getQueryKey: () => internalSquadsQueryKeys.getInternalSquadsTags.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get InternalSquads Tags')
})
