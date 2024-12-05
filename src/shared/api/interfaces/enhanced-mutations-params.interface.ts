import { QueryClient, UseMutationOptions } from '@tanstack/react-query'

export interface EnhancedMutationParams<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown
> extends Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationFn' | 'onError' | 'onSettled' | 'onSuccess'
    > {
    onError?: (
        error: TError,
        variables: TVariables,
        context: TContext | undefined,
        queryClient: QueryClient
    ) => unknown
    onSettled?: (
        data: TData | undefined,
        error: null | TError,
        variables: TVariables,
        context: TContext | undefined,
        queryClient: QueryClient
    ) => unknown
    onSuccess?: (
        data: TData,
        variables: TVariables,
        context: TContext,
        queryClient: QueryClient
    ) => unknown
}
