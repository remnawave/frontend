import { LoginCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { setToken } from '@entitites/auth/session-store'

import { createPostMutationHook } from '../../tsq-helpers'

export const AUTH_QUERY_KEY = 'auth'

export const useLogin = createPostMutationHook({
    endpoint: LoginCommand.TSQ_url,
    bodySchema: LoginCommand.RequestSchema,
    responseSchema: LoginCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: (data) => {
            setToken({ token: data.accessToken })
        },
        onError: (error) => {
            notifications.show({
                title: 'Login',
                message: error.message,
                color: 'red'
            })
        }
    }
})
