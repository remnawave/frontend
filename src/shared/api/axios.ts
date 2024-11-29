import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { logoutEvents } from '../emitters/emit-logout'

let authorizationToken = ''

export const instance = axios.create({
    baseURL: __DOMAIN_BACKEND__,
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
