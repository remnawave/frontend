import {
    AddUsersToExternalSquadCommand,
    CreateExternalSquadCommand,
    DeleteExternalSquadCommand,
    DeleteUsersFromExternalSquadCommand,
    UpdateExternalSquadCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateExternalSquad = createMutationHook({
    endpoint: UpdateExternalSquadCommand.TSQ_url,
    bodySchema: UpdateExternalSquadCommand.RequestSchema,
    responseSchema: UpdateExternalSquadCommand.ResponseSchema,
    requestMethod: UpdateExternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'External Squad updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update External Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteExternalSquad = createMutationHook({
    endpoint: DeleteExternalSquadCommand.TSQ_url,
    responseSchema: DeleteExternalSquadCommand.ResponseSchema,
    routeParamsSchema: DeleteExternalSquadCommand.RequestSchema,
    requestMethod: DeleteExternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'External Squad deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete External Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateExternalSquad = createMutationHook({
    endpoint: CreateExternalSquadCommand.TSQ_url,
    responseSchema: CreateExternalSquadCommand.ResponseSchema,
    bodySchema: CreateExternalSquadCommand.RequestSchema,
    requestMethod: CreateExternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'External Squad created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create External Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useAddUsersToExternalSquad = createMutationHook({
    endpoint: AddUsersToExternalSquadCommand.TSQ_url,
    responseSchema: AddUsersToExternalSquadCommand.ResponseSchema,
    routeParamsSchema: AddUsersToExternalSquadCommand.RequestSchema,
    requestMethod: AddUsersToExternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Add Users to External Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteUsersFromExternalSquad = createMutationHook({
    endpoint: DeleteUsersFromExternalSquadCommand.TSQ_url,
    responseSchema: DeleteUsersFromExternalSquadCommand.ResponseSchema,
    routeParamsSchema: DeleteUsersFromExternalSquadCommand.RequestSchema,
    requestMethod: DeleteUsersFromExternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Remove Users from External Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
