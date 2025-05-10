import { UpdateXrayConfigCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateConfig = createMutationHook({
    endpoint: UpdateXrayConfigCommand.TSQ_url,
    bodySchema: UpdateXrayConfigCommand.RequestSchema,
    responseSchema: UpdateXrayConfigCommand.ResponseSchema,
    requestMethod: UpdateXrayConfigCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Config updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update XRay Config`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
