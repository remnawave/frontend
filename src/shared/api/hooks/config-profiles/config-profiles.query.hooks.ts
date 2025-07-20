import {
    GetConfigProfileByUuidCommand,
    GetConfigProfilesCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const configProfilesQueryKeys = createQueryKeys('config-profiles', {
    getConfigProfiles: {
        queryKey: null
    },
    getConfigProfile: (route: GetConfigProfileByUuidCommand.Request) => ({
        queryKey: [route]
    })
})

export const useGetConfigProfiles = createGetQueryHook({
    endpoint: GetConfigProfilesCommand.TSQ_url,
    responseSchema: GetConfigProfilesCommand.ResponseSchema,
    getQueryKey: () => configProfilesQueryKeys.getConfigProfiles.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Config Profiles`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetConfigProfile = createGetQueryHook({
    endpoint: GetConfigProfileByUuidCommand.TSQ_url,
    responseSchema: GetConfigProfileByUuidCommand.ResponseSchema,
    routeParamsSchema: GetConfigProfileByUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => configProfilesQueryKeys.getConfigProfile(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Config Profile`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
