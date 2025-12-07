import { EncryptHappCryptoLinkCommand } from '@remnawave/backend-contract'

import { createMutationHook } from '@shared/api/tsq-helpers'

export const useEncryptSubscriptionLink = createMutationHook({
    endpoint: EncryptHappCryptoLinkCommand.TSQ_url,
    bodySchema: EncryptHappCryptoLinkCommand.RequestSchema,
    responseSchema: EncryptHappCryptoLinkCommand.ResponseSchema,
    requestMethod: EncryptHappCryptoLinkCommand.endpointDetails.REQUEST_METHOD
})
