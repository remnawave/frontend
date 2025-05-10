import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { createUrl, handleRequestError } from '../helpers'
import { CreateMutationHookArgs } from '../interfaces'
import { instance } from '../axios'

export function createMutationHook<
    RouteParamsSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType
>({
    endpoint,
    requestMethod,
    routeParams,
    queryParams,
    requestQuerySchema,
    bodySchema,
    responseSchema,
    rMutationParams
}: CreateMutationHookArgs<RouteParamsSchema, RequestQuerySchema, BodySchema, ResponseSchema>) {
    return (params?: {
        mutationFns?: Partial<typeof rMutationParams>
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
    }) => {
        const queryClient = useQueryClient()

        const validatedQuery = requestQuerySchema?.parse({ ...queryParams, ...params?.query })
        const baseUrl = createUrl(endpoint, validatedQuery, params?.route ?? routeParams)

        const mutationFn = async ({
            variables,
            route,
            query
        }: {
            mutationFns?: Partial<typeof rMutationParams>
            query?: z.infer<RequestQuerySchema>
            route?: z.infer<RouteParamsSchema>
            variables?: z.infer<BodySchema>
        }) => {
            const url = createUrl(baseUrl, query, route)

            return instance
                .request<z.infer<ResponseSchema>>({
                    method: requestMethod,
                    url,
                    data: bodySchema?.parse(variables)
                })
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
                query?: z.infer<RequestQuerySchema>
                route?: z.infer<RouteParamsSchema>
                variables?: z.infer<BodySchema>
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
