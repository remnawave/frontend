import {
    DeletePasskeyCommand,
    UpdatePasskeyCommand,
    VerifyPasskeyRegistrationCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const usePasskeyRegistrationVerify = createMutationHook({
    endpoint: VerifyPasskeyRegistrationCommand.TSQ_url,
    bodySchema: VerifyPasskeyRegistrationCommand.RequestSchema,
    responseSchema: VerifyPasskeyRegistrationCommand.ResponseSchema,
    requestMethod: VerifyPasskeyRegistrationCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Passkey Verified',
                message: 'Passkey verification successful',
                color: 'teal'
            })
        }
    }
})

export const useDeletePasskey = createMutationHook({
    endpoint: DeletePasskeyCommand.TSQ_url,
    bodySchema: DeletePasskeyCommand.RequestSchema,
    responseSchema: DeletePasskeyCommand.ResponseSchema,
    requestMethod: DeletePasskeyCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Passkey Deleted',
                message: 'Passkey deleted successfully',
                color: 'teal'
            })
        }
    }
})

export const useUpdatePasskey = createMutationHook({
    endpoint: UpdatePasskeyCommand.TSQ_url,
    bodySchema: UpdatePasskeyCommand.RequestSchema,
    responseSchema: UpdatePasskeyCommand.ResponseSchema,
    requestMethod: UpdatePasskeyCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Passkey Updated',
                message: 'Passkey updated successfully',
                color: 'teal'
            })
        }
    }
})
