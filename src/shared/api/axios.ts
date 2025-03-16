import consola from 'consola/browser'
import axios from 'axios'

import { logoutEvents } from '../emitters/emit-logout'

let authorizationToken = ''

let BASE_DOMAIN = __DOMAIN_BACKEND__
const isDev = __NODE_ENV__ === 'development'
const isDomainOverride = __DOMAIN_OVERRIDE__ === '1'

if (isDev) {
    BASE_DOMAIN = __DOMAIN_BACKEND__
} else {
    BASE_DOMAIN = window.location.origin
}

if (isDomainOverride) {
    BASE_DOMAIN = __DOMAIN_BACKEND__
}

export const instance = axios.create({
    baseURL: BASE_DOMAIN,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
})

instance.interceptors.request.use((config) => {
    config.headers.set('Authorization', `Bearer ${authorizationToken}`)
    return config
})

export const setAuthorizationToken = (token: string) => {
    authorizationToken = token
}

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            const responseStatus = error.response.status
            if (responseStatus === 403 || responseStatus === 401) {
                try {
                    logoutEvents.emit()
                } catch (error) {
                    consola.log('error', error)
                }

                // notifications.show({
                //     title: 'Unauthorized',
                //     message: 'You are not authorized to access this resource.'
                // })
            }
        }
        return Promise.reject(error)
    }
)
