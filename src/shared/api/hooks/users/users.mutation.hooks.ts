import {
    CreateUserCommand,
    DeleteUserCommand,
    DisableUserCommand,
    EnableUserCommand,
    RevokeUserSubscriptionCommand,
    UpdateUserCommand
} from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'

import {
    createDeleteMutationHook,
    createPatchMutationHook,
    createPostMutationHook
} from '../../tsq-helpers'

export const useCreateUser = createPostMutationHook({
    endpoint: CreateUserCommand.TSQ_url,
    bodySchema: CreateUserCommand.RequestSchema,
    responseSchema: CreateUserCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User created successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${CreateUserCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useUpdateUser = createPostMutationHook({
    endpoint: UpdateUserCommand.TSQ_url,
    bodySchema: UpdateUserCommand.RequestSchema,
    responseSchema: UpdateUserCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User updated successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${UpdateUserCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDeleteUser = createDeleteMutationHook({
    endpoint: DeleteUserCommand.TSQ_url,
    responseSchema: DeleteUserCommand.ResponseSchema,
    routeParamsSchema: DeleteUserCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User deleted successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${DeleteUserCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useRevokeUserSubscription = createPatchMutationHook({
    endpoint: RevokeUserSubscriptionCommand.TSQ_url,
    responseSchema: RevokeUserSubscriptionCommand.ResponseSchema,
    routeParamsSchema: RevokeUserSubscriptionCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User subscription revoked successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${RevokeUserSubscriptionCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useEnableUser = createPatchMutationHook({
    endpoint: EnableUserCommand.TSQ_url,
    responseSchema: EnableUserCommand.ResponseSchema,
    routeParamsSchema: EnableUserCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User enabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${EnableUserCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useDisableUser = createPatchMutationHook({
    endpoint: DisableUserCommand.TSQ_url,
    responseSchema: DisableUserCommand.ResponseSchema,
    routeParamsSchema: DisableUserCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User disabled successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${DisableUserCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
