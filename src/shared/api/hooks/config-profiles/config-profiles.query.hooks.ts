import {
    GetComputedConfigProfileByUuidCommand,
    GetConfigProfileByUuidCommand,
    GetConfigProfilesCommand,
    GetInboundsByProfileUuidCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const configProfilesQueryKeys = createQueryKeys('configProfiles', {
    getConfigProfiles: {
        queryKey: null
    },
    getConfigProfile: (route: GetConfigProfileByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getComputedConfigProfile: (route: GetComputedConfigProfileByUuidCommand.Request) => ({
        queryKey: [route]
    }),
    getConfigProfileInbounds: (route: GetConfigProfileByUuidCommand.Request) => ({
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
    errorHandler: (error) => errorHandler(error, 'Get All Config Profiles')
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
    errorHandler: (error) => errorHandler(error, 'Get Config Profile')
})

export const useGetConfigProfileInbounds = createGetQueryHook({
    endpoint: GetInboundsByProfileUuidCommand.TSQ_url,
    responseSchema: GetInboundsByProfileUuidCommand.ResponseSchema,
    routeParamsSchema: GetInboundsByProfileUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => configProfilesQueryKeys.getConfigProfileInbounds(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => errorHandler(error, 'Get Config Profile Inbounds')
})

export const useGetComputedConfigProfile = createGetQueryHook({
    endpoint: GetComputedConfigProfileByUuidCommand.TSQ_url,
    responseSchema: GetComputedConfigProfileByUuidCommand.ResponseSchema,
    routeParamsSchema: GetComputedConfigProfileByUuidCommand.RequestSchema,
    getQueryKey: ({ route }) => configProfilesQueryKeys.getComputedConfigProfile(route!).queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Get Computed Config Profile')
})
