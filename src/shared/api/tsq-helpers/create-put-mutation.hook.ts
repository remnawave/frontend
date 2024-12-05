import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { createUrl, handleRequestError } from '../helpers'
import { CreatePutMutationHookArgs } from '../interfaces'
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
export function createPutMutationHook<
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType,
    RouteParams extends Record<string, number | string | undefined> = {},
    QueryParams extends Record<string, number | string | undefined> = {}
>({
    endpoint,
    bodySchema,
    responseSchema,
    rMutationParams,
    options
}: CreatePutMutationHookArgs<BodySchema, ResponseSchema>) {
    return (params?: {
        mutationFns?: Partial<typeof rMutationParams>
        query?: QueryParams
        route?: RouteParams
    }) => {
        const queryClient = useQueryClient()
        const baseUrl = createUrl(endpoint, params?.query, params?.route)

        const mutationFn = async ({
            variables,
            route,
            query
        }: {
            mutationFns?: Partial<typeof rMutationParams>
            query?: QueryParams
            route?: RouteParams
            variables: z.infer<BodySchema>
        }) => {
            const url = createUrl(baseUrl, query, route)

            const config = options?.isMultipart
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : undefined

            return instance
                .put<z.infer<ResponseSchema>>(url, bodySchema.parse(variables), config)
                .then(async (response) => {
                    const result = await responseSchema.safeParseAsync(response.data)
                    if (!result.success) {
                        throw result.error
                    }
                    return result.data.response
                })
                .catch((error) => handleRequestError(error))
        }

        return useMutation<
            z.infer<ResponseSchema>['response'],
            Error,
            {
                mutationFns?: Partial<typeof rMutationParams>
                query?: QueryParams
                route?: RouteParams
                variables: z.infer<BodySchema>
            }
        >({
            ...rMutationParams,
            ...params?.mutationFns,
            mutationFn,
            onSuccess: (data, variables, context) => {
                rMutationParams?.onSuccess?.(data, variables, context, queryClient)
                params?.mutationFns?.onSuccess?.(data, variables, context, queryClient)
            },
            onError: (error, variables, context) =>
                rMutationParams?.onError?.(error, variables, context, queryClient),
            onSettled: (data, error, variables, context) =>
                rMutationParams?.onSettled?.(data, error, variables, context, queryClient)
        })
    }
}
