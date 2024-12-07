import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { CreatePatchMutationHookArgs } from '../interfaces'
import { createUrl, handleRequestError } from '../helpers'
import { instance } from '../axios'

/**
 * Create a custom hook for performing POST requests with react-query and Zod validation
 *
 * @example
 * const useCreateUser = createPostMutationHook({
 *  endpoint: '/api/users',
 *  bodySchema: createUserSchema,
 *  responseSchema: userSchema,
 *  rMutationParams: { onSuccess: () => queryClient.invalidateQueries('getUsers') },
 * });
 */
export function createPatchMutationHook<
    ResponseSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    RouteParamsSchema extends z.ZodType,
    ErrorHandler extends (error: unknown) => void = (error: unknown) => void
>({
    endpoint,
    responseSchema,
    requestQuerySchema,
    queryParams,
    routeParams,
    errorHandler,
    rMutationParams
}: CreatePatchMutationHookArgs<ResponseSchema, RequestQuerySchema, RouteParamsSchema>) {
    return (params?: {
        errorHandler?: ErrorHandler
        mutationFns?: Partial<typeof rMutationParams>
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
    }) => {
        const queryClient = useQueryClient()

        const validatedQuery = requestQuerySchema?.parse({ ...queryParams, ...params?.query })
        const baseUrl = createUrl(endpoint, validatedQuery, params?.route ?? routeParams)

        const mutationFn = async ({
            route,
            query
        }: {
            mutationFns?: Partial<typeof rMutationParams>
            query?: z.infer<RequestQuerySchema>
            route?: z.infer<RouteParamsSchema>
        }) => {
            const url = createUrl(baseUrl, query, route)

            return instance
                .patch<z.infer<ResponseSchema>>(url)
                .then(async (response) => {
                    const result = await responseSchema.safeParseAsync(response.data)
                    if (!result.success) {
                        throw result.error
                    }
                    return result.data.response
                })
                .catch((error) => errorHandler?.(error) ?? handleRequestError(error))
        }

        return useMutation<
            z.infer<ResponseSchema>['response'],
            Error,
            {
                mutationFns?: Partial<typeof rMutationParams>
                query?: z.infer<RequestQuerySchema>
                route?: z.infer<RouteParamsSchema>
            }
        >({
            ...rMutationParams,
            ...params?.mutationFns,
            mutationFn,
            onSuccess: (data, variables, context) => {
                rMutationParams?.onSuccess?.(data, variables, context, queryClient)
                params?.mutationFns?.onSuccess?.(data, variables, context, queryClient)
            },
            onError: (error, variables, context) => {
                rMutationParams?.onError?.(error, variables, context, queryClient)
                params?.mutationFns?.onError?.(error, variables, context, queryClient)
            },
            onSettled: (data, error, variables, context) =>
                rMutationParams?.onSettled?.(data, error, variables, context, queryClient)
        })
    }
}
