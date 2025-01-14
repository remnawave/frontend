import {
    GetAllNodesCommand,
    GetOneNodeCommand,
    GetPubKeyCommand
} from '@remnawave/backend-contract'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { sToMs } from '@shared/utils/time-utils'

import { createGetQueryHook } from '../../tsq-helpers'

export const nodesQueryKeys = createQueryKeys('nodes', {
    getAllNodes: {
        queryKey: null
    },
    getNode: (route: GetOneNodeCommand.Request) => ({
        queryKey: [route]
    }),
    getPubKey: {
        queryKey: null
    }
})

export const useGetNodes = createGetQueryHook({
    endpoint: GetAllNodesCommand.TSQ_url,
    responseSchema: GetAllNodesCommand.ResponseSchema,
    getQueryKey: () => nodesQueryKeys.getAllNodes.queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetAllNodesCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetNode = createGetQueryHook({
    endpoint: GetOneNodeCommand.TSQ_url,
    responseSchema: GetOneNodeCommand.ResponseSchema,
    routeParamsSchema: GetOneNodeCommand.RequestSchema,
    getQueryKey: ({ route }) => nodesQueryKeys.getNode(route!).queryKey,
    rQueryParams: {
        refetchOnMount: true,
        staleTime: sToMs(5),
        refetchInterval: sToMs(5)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetOneNodeCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
export const useGetPubKey = createGetQueryHook({
    endpoint: GetPubKeyCommand.TSQ_url,
    responseSchema: GetPubKeyCommand.ResponseSchema,
    getQueryKey: () => nodesQueryKeys.getPubKey.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        staleTime: sToMs(60)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetPubKeyCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
