import { UpdateSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createPostMutationHook } from '../../tsq-helpers'

export const useUpdateSubscriptionTemplate = createPostMutationHook({
    endpoint: UpdateSubscriptionTemplateCommand.TSQ_url,
    bodySchema: UpdateSubscriptionTemplateCommand.RequestSchema,
    responseSchema: UpdateSubscriptionTemplateCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Subscription template updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${UpdateSubscriptionTemplateCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
