import { CreateSshTicketCommand } from '@remnawave/backend-contract'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateSshTicket = createMutationHook({
    endpoint: CreateSshTicketCommand.TSQ_url,
    responseSchema: CreateSshTicketCommand.ResponseSchema,
    routeParamsSchema: CreateSshTicketCommand.RequestParamSchema,
    requestMethod: CreateSshTicketCommand.endpointDetails.REQUEST_METHOD
})
