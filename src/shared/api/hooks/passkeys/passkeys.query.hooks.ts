import {
    GetAllPasskeysCommand,
    GetPasskeyRegistrationOptionsCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '../../tsq-helpers'

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
    errorHandler: (error) => {
        notifications.show({
            title: 'Authentication Error',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetAllPasskeys = createGetQueryHook({
    endpoint: GetAllPasskeysCommand.TSQ_url,
    responseSchema: GetAllPasskeysCommand.ResponseSchema,
    getQueryKey: () => passkeysQueryKeys.getAllPasskeys.queryKey,
    rQueryParams: {
        refetchOnMount: false
    },
    errorHandler: (error) => {
        notifications.show({
            title: 'Authentication Error',
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
