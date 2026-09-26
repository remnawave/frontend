import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
    GetExternalSquadByUuidCommand,
    GetExternalSquadsCommand,
    GetExternalSquadsTagsCommand
} from '@remnawave/backend-contract'
import { keepPreviousData } from '@tanstack/react-query'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const externalSquadsQueryKeys = createQueryKeys('externalSquads', {
    getExternalSquadsTags: {
        queryKey: null
    },
    getExternalSquads: {
        queryKey: null
    },
    getExternalSquad: (route: GetExternalSquadByUuidCommand.RequestParam) => ({
        queryKey: [route]
    })
})

export const useGetExternalSquads = createGetQueryHook({
    endpoint: GetExternalSquadsCommand.TSQ_url,
    responseSchema: GetExternalSquadsCommand.ResponseSchema,
    getQueryKey: () => externalSquadsQueryKeys.getExternalSquads.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        staleTime: sToMs(30)
    },

    errorHandler: (error) => errorHandler(error, 'Get All External Squads')
})

export const useGetExternalSquad = createGetQueryHook({
    endpoint: GetExternalSquadByUuidCommand.TSQ_url,
    responseSchema: GetExternalSquadByUuidCommand.ResponseSchema,
    routeParamsSchema: GetExternalSquadByUuidCommand.RequestParamSchema,
    getQueryKey: ({ route }) => externalSquadsQueryKeys.getExternalSquad(route!).queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get External Squad')
})

export const useGetExternalSquadsTags = createGetQueryHook({
    endpoint: GetExternalSquadsTagsCommand.TSQ_url,
    responseSchema: GetExternalSquadsTagsCommand.ResponseSchema,
    getQueryKey: () => externalSquadsQueryKeys.getExternalSquadsTags.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get ExternalSquads Tags')
})
