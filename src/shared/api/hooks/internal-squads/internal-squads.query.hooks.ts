import {
    GetInternalSquadByUuidCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const internalSquadsQueryKeys = createQueryKeys('internalSquads', {
    getInternalSquads: {
        queryKey: null
    },
    getInternalSquad: (route: GetInternalSquadByUuidCommand.Request) => ({
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
        staleTime: sToMs(15)
    },

    errorHandler: (error) => {
        notifications.show({
            title: `Get All Internal Squads`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
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
    errorHandler: (error) => {
        notifications.show({
            title: `Get Internal Squad`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
