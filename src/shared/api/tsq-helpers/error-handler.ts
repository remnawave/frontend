import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

const BYPASS_ERROR_STATUSES = [401, 403]

export function errorHandler(error: unknown, title: string) {
    if (error instanceof AxiosError) {
        if (error.response) {
            if (BYPASS_ERROR_STATUSES.includes(error.response.status)) {
                return
            }
        }
    }

    notifications.show({
        title,
        message: error instanceof Error ? error.message : 'Request failed with unknown error.',
        color: 'red'
    })
}
