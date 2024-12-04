import { LoginCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createPostMutationHook } from '../../tsq-helpers'

export const useLogin = createPostMutationHook({
    endpoint: LoginCommand.url,
    bodySchema: LoginCommand.RequestSchema,
    responseSchema: LoginCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({ message: error.message, color: 'red' })
        }
    }
})
