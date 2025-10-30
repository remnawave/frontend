import {
    GetAllPasskeysCommand,
    GetPasskeyRegistrationOptionsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

export const passkeysQueryKeys = createQueryKeys('passkeys', {
    getAllPasskeys: {
        queryKey: null
    },
    getPasskeyRegistrationOptions: {
        queryKey: null
    }
})

export const usePasskeyRegistrationOptions = createGetQueryHook({
    endpoint: GetPasskeyRegistrationOptionsCommand.TSQ_url,
    responseSchema: GetPasskeyRegistrationOptionsCommand.ResponseSchema,
    getQueryKey: () => passkeysQueryKeys.getPasskeyRegistrationOptions.queryKey,
    rQueryParams: {
        enabled: false
    },
    errorHandler: (error) => errorHandler(error, 'Get Passkey Registration Options')
})

export const useGetAllPasskeys = createGetQueryHook({
    endpoint: GetAllPasskeysCommand.TSQ_url,
    responseSchema: GetAllPasskeysCommand.ResponseSchema,
    getQueryKey: () => passkeysQueryKeys.getAllPasskeys.queryKey,
    rQueryParams: {
        refetchOnMount: false
    },
    errorHandler: (error) => errorHandler(error, 'Get All Passkeys')
})
