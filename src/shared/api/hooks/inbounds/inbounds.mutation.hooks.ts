import {
    AddInboundToNodesCommand,
    AddInboundToUsersCommand,
    RemoveInboundFromNodesCommand,
    RemoveInboundFromUsersCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import { createPostMutationHook } from '../../tsq-helpers'

export const useAddInboundToUsers = createPostMutationHook({
    endpoint: AddInboundToUsersCommand.TSQ_url,
    bodySchema: AddInboundToUsersCommand.RequestSchema,
    responseSchema: AddInboundToUsersCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${AddInboundToUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRemoveInboundFromUsers = createPostMutationHook({
    endpoint: RemoveInboundFromUsersCommand.TSQ_url,
    bodySchema: RemoveInboundFromUsersCommand.RequestSchema,
    responseSchema: RemoveInboundFromUsersCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${RemoveInboundFromUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useAddInboundToNodes = createPostMutationHook({
    endpoint: AddInboundToNodesCommand.TSQ_url,
    bodySchema: AddInboundToNodesCommand.RequestSchema,
    responseSchema: AddInboundToNodesCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${AddInboundToNodesCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRemoveInboundFromNodes = createPostMutationHook({
    endpoint: RemoveInboundFromNodesCommand.TSQ_url,
    bodySchema: RemoveInboundFromNodesCommand.RequestSchema,
    responseSchema: RemoveInboundFromNodesCommand.ResponseSchema,
    rMutationParams: {
        onError: (error) => {
            notifications.show({
                title: `${RemoveInboundFromNodesCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
