import { GetRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const remnawaveSettingsQueryKeys = createQueryKeys('remnawaveSettings', {
    getRemnawaveSettings: {
        queryKey: null
    }
})

export const useGetRemnawaveSettings = createGetQueryHook({
    endpoint: GetRemnawaveSettingsCommand.TSQ_url,
    responseSchema: GetRemnawaveSettingsCommand.ResponseSchema,
    getQueryKey: () => remnawaveSettingsQueryKeys.getRemnawaveSettings.queryKey,
    rQueryParams: {
        refetchOnMount: false,
        staleTime: sToMs(30)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get Remnawave Settings`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
