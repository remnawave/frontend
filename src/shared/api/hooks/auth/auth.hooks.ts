import { LoginCommand, RegisterCommand, TelegramCallbackCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { setToken } from '@entities/auth/session-store'

import { createMutationHook } from '../../tsq-helpers'

export const AUTH_QUERY_KEY = 'auth'

export const useLogin = createMutationHook({
    endpoint: LoginCommand.TSQ_url,
    bodySchema: LoginCommand.RequestSchema,
    responseSchema: LoginCommand.ResponseSchema,
    requestMethod: LoginCommand.endpointDetails.REQUEST_METHOD,
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

export const useRegister = createMutationHook({
    endpoint: RegisterCommand.TSQ_url,
    bodySchema: RegisterCommand.RequestSchema,
    responseSchema: RegisterCommand.ResponseSchema,
    requestMethod: RegisterCommand.endpointDetails.REQUEST_METHOD,
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

export const useTelegramCallback = createMutationHook({
    endpoint: TelegramCallbackCommand.TSQ_url,
    bodySchema: TelegramCallbackCommand.RequestSchema,
    responseSchema: TelegramCallbackCommand.ResponseSchema,
    requestMethod: TelegramCallbackCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: (data) => {
            setToken({ token: data.accessToken })
        }
    }
})
