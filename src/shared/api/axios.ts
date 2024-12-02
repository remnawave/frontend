import { notifications } from '@mantine/notifications'
import axios from 'axios'

import { logoutEvents } from '../emitters/emit-logout'

let authorizationToken = ''

let BASE_DOMAIN = __DOMAIN_BACKEND__
const isDev = __NODE_ENV__ === 'development'

if (isDev) {
    BASE_DOMAIN = __DOMAIN_BACKEND__
} else {
    BASE_DOMAIN = window.location.origin
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
                    console.log('error', error)
                }

                notifications.show({
                    title: 'Unauthorized',
                    message: 'You are not authorized to access this resource.'
                })
            }
        }
        return Promise.reject(error)
    }
)
