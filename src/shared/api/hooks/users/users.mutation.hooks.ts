import {
    BulkAllResetTrafficUsersCommand,
    BulkAllUpdateUsersCommand,
    BulkDeleteUsersByStatusCommand,
    BulkDeleteUsersCommand,
    BulkResetTrafficUsersCommand,
    BulkRevokeUsersSubscriptionCommand,
    BulkUpdateUsersCommand,
    BulkUpdateUsersInboundsCommand,
    CreateUserCommand,
    DeleteUserCommand,
    DisableUserCommand,
    EnableUserCommand,
    ResetUserTrafficCommand,
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

export const useResetUserTraffic = createPatchMutationHook({
    endpoint: ResetUserTrafficCommand.TSQ_url,
    responseSchema: ResetUserTrafficCommand.ResponseSchema,
    routeParamsSchema: ResetUserTrafficCommand.RequestSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'User traffic reset successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${ResetUserTrafficCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkDeleteUsersByStatus = createPostMutationHook({
    endpoint: BulkDeleteUsersByStatusCommand.TSQ_url,
    bodySchema: BulkDeleteUsersByStatusCommand.RequestSchema,
    responseSchema: BulkDeleteUsersByStatusCommand.ResponseSchema
})

export const useBulkUpdateUsers = createPostMutationHook({
    endpoint: BulkUpdateUsersCommand.TSQ_url,
    bodySchema: BulkUpdateUsersCommand.RequestSchema,
    responseSchema: BulkUpdateUsersCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkUpdateUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkResetTraffic = createPostMutationHook({
    endpoint: BulkResetTrafficUsersCommand.TSQ_url,
    bodySchema: BulkResetTrafficUsersCommand.RequestSchema,
    responseSchema: BulkResetTrafficUsersCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkResetTrafficUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkRevokeUsersSubscription = createPostMutationHook({
    endpoint: BulkRevokeUsersSubscriptionCommand.TSQ_url,
    bodySchema: BulkRevokeUsersSubscriptionCommand.RequestSchema,
    responseSchema: BulkRevokeUsersSubscriptionCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkRevokeUsersSubscriptionCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkDeleteUsers = createPostMutationHook({
    endpoint: BulkDeleteUsersCommand.TSQ_url,
    bodySchema: BulkDeleteUsersCommand.RequestSchema,
    responseSchema: BulkDeleteUsersCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkDeleteUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkSetActiveInbounds = createPostMutationHook({
    endpoint: BulkUpdateUsersInboundsCommand.TSQ_url,
    bodySchema: BulkUpdateUsersInboundsCommand.RequestSchema,
    responseSchema: BulkUpdateUsersInboundsCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkUpdateUsersInboundsCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkAllUpdateUsers = createPostMutationHook({
    endpoint: BulkAllUpdateUsersCommand.TSQ_url,
    bodySchema: BulkAllUpdateUsersCommand.RequestSchema,
    responseSchema: BulkAllUpdateUsersCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkAllUpdateUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})

export const useBulkAllResetTrafficUsers = createPatchMutationHook({
    endpoint: BulkAllResetTrafficUsersCommand.TSQ_url,
    responseSchema: BulkAllResetTrafficUsersCommand.ResponseSchema,
    rMutationParams: {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Task added to queue successfully',
                color: 'teal'
            })
        },
        onError: (error) => {
            notifications.show({
                title: `${BulkAllResetTrafficUsersCommand.TSQ_url}`,
                message:
                    error instanceof Error ? error.message : `Request failed with unknown error.`,
                color: 'red'
            })
        }
    }
})
