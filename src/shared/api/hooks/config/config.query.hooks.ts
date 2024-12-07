import { GetXrayConfigCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const configQueryKeys = createQueryKeys('config', {
    getConfig: {
        queryKey: null
    }
})

export const useGetConfig = createGetQueryHook({
    endpoint: GetXrayConfigCommand.TSQ_url,
    responseSchema: GetXrayConfigCommand.ResponseSchema,
    getQueryKey: () => configQueryKeys.getConfig.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(120)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetXrayConfigCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
