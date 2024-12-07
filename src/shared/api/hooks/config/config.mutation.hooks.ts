import { UpdateXrayConfigCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createPostMutationHook } from '../../tsq-helpers'

export const useUpdateConfig = createPostMutationHook({
    endpoint: UpdateXrayConfigCommand.TSQ_url,
    bodySchema: UpdateXrayConfigCommand.RequestSchema,
    responseSchema: UpdateXrayConfigCommand.ResponseSchema,
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
                title: `${UpdateXrayConfigCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
