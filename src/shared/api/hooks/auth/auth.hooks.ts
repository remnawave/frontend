import {
    LoginCommand,
    OAuth2AuthorizeCommand,
    OAuth2CallbackCommand,
    RegisterCommand,
    TelegramCallbackCommand
} from '@remnawave/backend-contract'
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

export const useOauth2Callback = createMutationHook({
    endpoint: OAuth2CallbackCommand.TSQ_url,
    bodySchema: OAuth2CallbackCommand.RequestSchema,
    responseSchema: OAuth2CallbackCommand.ResponseSchema,
    requestMethod: OAuth2CallbackCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: (data) => {
            setToken({ token: data.accessToken })
        }
    }
})

export const useOAuth2Authorize = createMutationHook({
    endpoint: OAuth2AuthorizeCommand.TSQ_url,
    bodySchema: OAuth2AuthorizeCommand.RequestSchema,
    responseSchema: OAuth2AuthorizeCommand.ResponseSchema,
    requestMethod: OAuth2AuthorizeCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: 'OAuth2 Authorize',
                message: error.message,
                color: 'red'
            })
        }
    }
})
