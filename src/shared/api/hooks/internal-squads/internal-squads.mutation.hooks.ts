import {
    AddUsersToInternalSquadCommand,
    CreateInternalSquadCommand,
    DeleteInternalSquadCommand,
    DeleteUsersFromInternalSquadCommand,
    ReorderInternalSquadCommand,
    UpdateInternalSquadCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createMutationHook } from '../../tsq-helpers'

export const useUpdateInternalSquad = createMutationHook({
    endpoint: UpdateInternalSquadCommand.TSQ_url,
    bodySchema: UpdateInternalSquadCommand.RequestSchema,
    responseSchema: UpdateInternalSquadCommand.ResponseSchema,
    requestMethod: UpdateInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Internal Squad updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Update Internal Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteInternalSquad = createMutationHook({
    endpoint: DeleteInternalSquadCommand.TSQ_url,
    responseSchema: DeleteInternalSquadCommand.ResponseSchema,
    routeParamsSchema: DeleteInternalSquadCommand.RequestSchema,
    requestMethod: DeleteInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Internal Squad deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Delete Internal Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useCreateInternalSquad = createMutationHook({
    endpoint: CreateInternalSquadCommand.TSQ_url,
    responseSchema: CreateInternalSquadCommand.ResponseSchema,
    bodySchema: CreateInternalSquadCommand.RequestSchema,
    requestMethod: CreateInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Internal Squad created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `Create Internal Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useAddUsersToInternalSquad = createMutationHook({
    endpoint: AddUsersToInternalSquadCommand.TSQ_url,
    responseSchema: AddUsersToInternalSquadCommand.ResponseSchema,
    routeParamsSchema: AddUsersToInternalSquadCommand.RequestSchema,
    requestMethod: AddUsersToInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Add Users to Internal Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteUsersFromInternalSquad = createMutationHook({
    endpoint: DeleteUsersFromInternalSquadCommand.TSQ_url,
    responseSchema: DeleteUsersFromInternalSquadCommand.ResponseSchema,
    routeParamsSchema: DeleteUsersFromInternalSquadCommand.RequestSchema,
    requestMethod: DeleteUsersFromInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Remove Users from Internal Squad`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useReorderInternalSquads = createMutationHook({
    endpoint: ReorderInternalSquadCommand.TSQ_url,
    bodySchema: ReorderInternalSquadCommand.RequestSchema,
    responseSchema: ReorderInternalSquadCommand.ResponseSchema,
    requestMethod: ReorderInternalSquadCommand.endpointDetails.REQUEST_METHOD,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `Reorder Internal Squads`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
