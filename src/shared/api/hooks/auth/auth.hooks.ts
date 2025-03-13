import { LoginCommand, RegisterCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { setToken } from '@entities/auth/session-store'

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

export const useRegister = createPostMutationHook({
    endpoint: RegisterCommand.TSQ_url,
    bodySchema: RegisterCommand.RequestSchema,
    responseSchema: RegisterCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: (data) => {
            notifications.show({
                title: 'Register',
                message: 'User registered successfully',
                color: 'green'
            })
            setToken({ token: data.accessToken })
        },
        onError: (error) => {
            notifications.show({
                title: 'Register',
                message: error.message,
                color: 'red'
            })
        }
    }
})
