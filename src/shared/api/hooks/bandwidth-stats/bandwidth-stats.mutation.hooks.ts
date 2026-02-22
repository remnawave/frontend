import { CreateUserIpsJobCommand } from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateUserIpsJob = createMutationHook({
    endpoint: CreateUserIpsJobCommand.TSQ_url,
    routeParamsSchema: CreateUserIpsJobCommand.RequestSchema,
    responseSchema: CreateUserIpsJobCommand.ResponseSchema,
    requestMethod: CreateUserIpsJobCommand.endpointDetails.REQUEST_METHOD
})
