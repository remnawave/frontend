import {
    DropConnectionsCommand,
    FetchIpsCommand,
    FetchUsersIpsCommand,
    FetchUsersIpsResultCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useFetchIps = createMutationHook({
    endpoint: FetchIpsCommand.TSQ_url,
    routeParamsSchema: FetchIpsCommand.RequestSchema,
    responseSchema: FetchIpsCommand.ResponseSchema,
    requestMethod: FetchIpsCommand.endpointDetails.REQUEST_METHOD
})

export const useFetchUsersIps = createMutationHook({
    endpoint: FetchUsersIpsCommand.TSQ_url,
    routeParamsSchema: FetchUsersIpsCommand.RequestSchema,
    responseSchema: FetchUsersIpsCommand.ResponseSchema,
    requestMethod: FetchUsersIpsCommand.endpointDetails.REQUEST_METHOD
})

export const useFetchUsersIpsResultMutation = createMutationHook({
    endpoint: FetchUsersIpsResultCommand.TSQ_url,
    responseSchema: FetchUsersIpsResultCommand.ResponseSchema,
    routeParamsSchema: FetchUsersIpsResultCommand.RequestSchema,
    requestMethod: FetchUsersIpsResultCommand.endpointDetails.REQUEST_METHOD
})

export const useDropConnections = createMutationHook({
    endpoint: DropConnectionsCommand.TSQ_url,
    bodySchema: DropConnectionsCommand.RequestSchema,
    responseSchema: DropConnectionsCommand.ResponseSchema,
    requestMethod: DropConnectionsCommand.endpointDetails.REQUEST_METHOD
})
