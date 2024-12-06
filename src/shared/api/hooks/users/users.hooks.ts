import {
    CreateUserCommand,
    DeleteUserCommand,
    DisableUserCommand,
    EnableUserCommand,
    GetAllUsersV2Command,
    GetStatsCommand,
    GetUserByUuidCommand,
    RevokeUserSubscriptionCommand,
    UpdateUserCommand
} from '@remnawave/backend-contract'
import {
    createQueryKeys,
    createQueryKeyStore,
    inferQueryKeys
} from '@lukemorales/query-key-factory'
import { keepPreviousData, QueryFunctionContext, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

import { UsersTableFilters } from '@features/dashboard/users/users-table/model/interfaces'
import { sToMs } from '@shared/utils/time-utils'

import {
    createDeleteMutationHook,
    createGetQueryHook,
    createPatchMutationHook,
    createPostMutationHook
} from '../../tsq-helpers'

export const USERS_QUERY_KEY = 'users'
const STALE_TIME = sToMs(5)
const REFETCH_INTERVAL = sToMs(5.1)

export const usersQueryKeys = createQueryKeys('users', {
    getAllUsers: (filters?: GetAllUsersV2Command.RequestQuery) => ({
        queryKey: [filters]
    }),
    getUserByUuid: (uuid?: GetUserByUuidCommand.Request) => ({
        queryKey: [uuid]
    })
})

export const useInvalidateUsersTSQ = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
}

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

export const useGetUserByUuid = createGetQueryHook({
    endpoint: GetUserByUuidCommand.TSQ_url,
    responseSchema: GetUserByUuidCommand.ResponseSchema,
    routeParamsSchema: GetUserByUuidCommand.RequestSchema,
    rQueryParams: {
        queryKey: usersQueryKeys.getUserByUuid().queryKey,
        staleTime: sToMs(20),
        refetchInterval: sToMs(35)
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetStatsCommand.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})

export const useGetUsersV2 = createGetQueryHook({
    endpoint: GetAllUsersV2Command.TSQ_url,
    responseSchema: GetAllUsersV2Command.ResponseSchema,
    requestQuerySchema: GetAllUsersV2Command.RequestQuerySchema,
    rQueryParams: {
        queryKey: usersQueryKeys.getAllUsers({}).queryKey,
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        placeholderData: keepPreviousData,
        refetchOnMount: true
    },
    errorHandler: (error) => {
        notifications.show({
            title: `${GetAllUsersV2Command.url}`,
            message: error instanceof Error ? error.message : `Request failed with unknown error.`,
            color: 'red'
        })
    }
})
