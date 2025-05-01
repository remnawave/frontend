import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { createGetQueryHook } from '../../tsq-helpers'

export const hostsQueryKeys = createQueryKeys('hosts', {
    getAllHosts: {
        queryKey: null
    }
})

export const useGetHosts = createGetQueryHook({
    endpoint: GetAllHostsCommand.TSQ_url,
    responseSchema: GetAllHostsCommand.ResponseSchema,
    getQueryKey: () => hostsQueryKeys.getAllHosts.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `Get All Hosts`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
