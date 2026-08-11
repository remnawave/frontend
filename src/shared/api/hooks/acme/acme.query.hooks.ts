import { createQueryKeys } from '@lukemorales/query-key-factory'

import {
    GetAcmeCertificateEventsCommand,
    GetAcmeCertificatesCommand,
    GetAcmeCredentialsCommand,
    GetAcmePersistRecordCommand
} from '@shared/api/contracts/acme.contract'
import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const acmeQueryKeys = createQueryKeys('acme', {
    getCertificateEvents: (route: GetAcmeCertificateEventsCommand.RequestParam) => ({
        queryKey: [route]
    }),
    getCertificates: {
        queryKey: null
    },
    getCredentials: {
        queryKey: null
    },
    getPersistRecord: (route: GetAcmePersistRecordCommand.RequestParam) => ({
        queryKey: [route]
    })
})

export const useGetAcmeCredentials = createGetQueryHook({
    endpoint: GetAcmeCredentialsCommand.TSQ_url,
    errorHandler: (error) => errorHandler(error, 'Get ACME credentials'),
    getQueryKey: () => acmeQueryKeys.getCredentials.queryKey,
    responseSchema: GetAcmeCredentialsCommand.ResponseSchema,
    rQueryParams: {
        staleTime: sToMs(10)
    }
})

export const useGetAcmeCertificates = createGetQueryHook({
    endpoint: GetAcmeCertificatesCommand.TSQ_url,
    errorHandler: (error) => errorHandler(error, 'Get ACME certificates'),
    getQueryKey: () => acmeQueryKeys.getCertificates.queryKey,
    responseSchema: GetAcmeCertificatesCommand.ResponseSchema,
    rQueryParams: {
        // An order takes tens of seconds and moves the certificate through
        // ISSUING to ACTIVE or ERROR; polling is what makes that visible without
        // the operator reloading the page.
        refetchInterval: sToMs(10),
        staleTime: sToMs(5)
    }
})

export const useGetAcmeCertificateEvents = createGetQueryHook({
    endpoint: GetAcmeCertificateEventsCommand.TSQ_url,
    errorHandler: (error) => errorHandler(error, 'Get certificate events'),
    getQueryKey: ({ route }) => acmeQueryKeys.getCertificateEvents(route!).queryKey,
    responseSchema: GetAcmeCertificateEventsCommand.ResponseSchema,
    routeParamsSchema: GetAcmeCertificateEventsCommand.RequestParamSchema,
    rQueryParams: {
        refetchInterval: sToMs(10)
    }
})

export const useGetAcmePersistRecord = createGetQueryHook({
    endpoint: GetAcmePersistRecordCommand.TSQ_url,
    errorHandler: (error) => errorHandler(error, 'Get persistent authorization record'),
    getQueryKey: ({ route }) => acmeQueryKeys.getPersistRecord(route!).queryKey,
    responseSchema: GetAcmePersistRecordCommand.ResponseSchema,
    routeParamsSchema: GetAcmePersistRecordCommand.RequestParamSchema,
    rQueryParams: {
        retry: false,
        staleTime: sToMs(30)
    }
})
