import {
    CreateInternalSquadCommand,
    DeleteInternalSquadCommand,
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
