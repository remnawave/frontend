import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createPostMutationHook } from '../../tsq-helpers'

export const useUpdateSubscriptionSettings = createPostMutationHook({
    endpoint: UpdateSubscriptionSettingsCommand.TSQ_url,
    bodySchema: UpdateSubscriptionSettingsCommand.RequestSchema,
    responseSchema: UpdateSubscriptionSettingsCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription settings updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: 'Error updating subscription settings',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
