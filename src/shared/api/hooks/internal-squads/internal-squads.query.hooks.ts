import {
    GetInternalSquadAccessibleNodesCommand,
    GetInternalSquadByUuidCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const internalSquadsQueryKeys = createQueryKeys('internalSquads', {
    getInternalSquads: {
        queryKey: null
    },
    getInternalSquad: (route: GetInternalSquadByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getInternalSquadAccessibleNodes: (route: GetInternalSquadAccessibleNodesCommand.Request) => ({
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
    endpoint: GetInternalSquadByUuidCommand.TSQ_url,
    responseSchema: GetInternalSquadByUuidCommand.ResponseSchema,
    routeParamsSchema: GetInternalSquadByUuidCommand.RequestSchema,
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
    routeParamsSchema: GetInternalSquadAccessibleNodesCommand.RequestSchema,
    getQueryKey: ({ route }) =>
        internalSquadsQueryKeys.getInternalSquadAccessibleNodes(route!).queryKey,
    rQueryParams: {
        staleTime: sToMs(15)
    },
    errorHandler: (error) => errorHandler(error, 'Get Internal Squad Accessible Nodes')
})
