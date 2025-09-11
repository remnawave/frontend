import {
    DeleteAllUserHwidDevicesCommand,
    DeleteUserHwidDeviceCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useDeleteUserHwidDevice = createMutationHook({
    endpoint: DeleteUserHwidDeviceCommand.TSQ_url,
    bodySchema: DeleteUserHwidDeviceCommand.RequestSchema,
    responseSchema: DeleteUserHwidDeviceCommand.ResponseSchema,
    requestMethod: DeleteUserHwidDeviceCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Device deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: 'Delete Device',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteAllUserHwidDevices = createMutationHook({
    endpoint: DeleteAllUserHwidDevicesCommand.TSQ_url,
    bodySchema: DeleteAllUserHwidDevicesCommand.RequestSchema,
    responseSchema: DeleteAllUserHwidDevicesCommand.ResponseSchema,
    requestMethod: DeleteAllUserHwidDevicesCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'All devices deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: 'Delete All Devices',
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
