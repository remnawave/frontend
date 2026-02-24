import { DropConnectionsCommand, FetchIpsCommand } from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useFetchIps = createMutationHook({
    endpoint: FetchIpsCommand.TSQ_url,
    routeParamsSchema: FetchIpsCommand.RequestSchema,
    responseSchema: FetchIpsCommand.ResponseSchema,
    requestMethod: FetchIpsCommand.endpointDetails.REQUEST_METHOD
})

export const useDropConnections = createMutationHook({
    endpoint: DropConnectionsCommand.TSQ_url,
    bodySchema: DropConnectionsCommand.RequestSchema,
    responseSchema: DropConnectionsCommand.ResponseSchema,
    requestMethod: DropConnectionsCommand.endpointDetails.REQUEST_METHOD
})
