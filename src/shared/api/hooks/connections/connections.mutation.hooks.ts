import {
    DropConnectionsCommand,
    ConnectionsByUserCommand,
    ConnectionsByNodeCommand,
    ConnectionsByNodeResultCommand,
    GeocheckByNodeCommand
} from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useConnectionsByUser = createMutationHook({
    endpoint: ConnectionsByUserCommand.TSQ_url,
    routeParamsSchema: ConnectionsByUserCommand.RequestParamSchema,
    responseSchema: ConnectionsByUserCommand.ResponseSchema,
    requestMethod: ConnectionsByUserCommand.endpointDetails.REQUEST_METHOD
})

export const useConnectionsByNode = createMutationHook({
    endpoint: ConnectionsByNodeCommand.TSQ_url,
    routeParamsSchema: ConnectionsByNodeCommand.RequestParamSchema,
    responseSchema: ConnectionsByNodeCommand.ResponseSchema,
    requestMethod: ConnectionsByNodeCommand.endpointDetails.REQUEST_METHOD
})

export const useConnectionsByNodeResultMutation = createMutationHook({
    endpoint: ConnectionsByNodeResultCommand.TSQ_url,
    responseSchema: ConnectionsByNodeResultCommand.ResponseSchema,
    routeParamsSchema: ConnectionsByNodeResultCommand.RequestParamSchema,
    requestMethod: ConnectionsByNodeResultCommand.endpointDetails.REQUEST_METHOD
})

export const useGeocheckByNode = createMutationHook({
    endpoint: GeocheckByNodeCommand.TSQ_url,
    routeParamsSchema: GeocheckByNodeCommand.RequestParamSchema,
    bodySchema: GeocheckByNodeCommand.RequestBodySchema,
    responseSchema: GeocheckByNodeCommand.ResponseSchema,
    requestMethod: GeocheckByNodeCommand.endpointDetails.REQUEST_METHOD
})

export const useDropConnections = createMutationHook({
    endpoint: DropConnectionsCommand.TSQ_url,
    bodySchema: DropConnectionsCommand.RequestBodySchema,
    requestMethod: DropConnectionsCommand.endpointDetails.REQUEST_METHOD
})
