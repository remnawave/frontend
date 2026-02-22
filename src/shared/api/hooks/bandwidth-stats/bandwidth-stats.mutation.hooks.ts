import { CreateUserIpsJobCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useCreateUserIpsJob = createMutationHook({
    endpoint: CreateUserIpsJobCommand.TSQ_url,
    routeParamsSchema: CreateUserIpsJobCommand.RequestSchema,
    responseSchema: CreateUserIpsJobCommand.ResponseSchema,
    requestMethod: CreateUserIpsJobCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User IPs job created successfully',
                color: 'teal'
            })
        }
    }
})
