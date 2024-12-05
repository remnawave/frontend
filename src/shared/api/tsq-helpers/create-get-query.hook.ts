import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { z } from 'zod'

import { createUrl, getQueryKey, handleRequestError } from '../helpers'
import { CreateGetQueryHookArgs } from '../interfaces'
import { instance } from '../axios'

/**
 * Create a custom hook for performing GET requests with react-query and Zod validation
 *
 * @example
 * const useGetUser = createGetQueryHook<typeof userSchema, { id: string }>({
 *   endpoint: '/api/users/:id',
 *   responseSchema: userSchema,
 *   rQueryParams: { queryKey: ['getUser'] },
 * });
 *
 * const { data, error } = useGetUser({ route: { id: 1 } });
 */
export function createGetQueryHook<
    ResponseSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    RouteParamsSchema extends z.ZodType,
    ErrorHandler extends (error: unknown) => void = (error: unknown) => void
>({
    endpoint,
    responseSchema,
    requestQuerySchema,
    rQueryParams,
    queryParams,
    routeParams,
    errorHandler
}: CreateGetQueryHookArgs<ResponseSchema, RequestQuerySchema, RouteParamsSchema>) {
    const queryFn = async (params?: {
        errorHandler?: ErrorHandler
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
    }) => {
        const validatedQuery = requestQuerySchema?.parse({ ...queryParams, ...params?.query })

        const url = createUrl(endpoint, validatedQuery, params?.route ?? routeParams)

        return instance
            .get<z.infer<ResponseSchema>>(url)
            .then(async (response) => {
                const result = await responseSchema.safeParseAsync(response.data)
                if (!result.success) {
                    throw result.error
                }
                return result.data.response
            })
            .catch((error) => errorHandler?.(error) ?? handleRequestError(error))
    }

    return (params?: {
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
        rQueryParams?: Omit<typeof rQueryParams, 'queryKey'>
    }) =>
        useQuery({
            ...rQueryParams,
            ...params?.rQueryParams,
            queryKey: getQueryKey(rQueryParams.queryKey, params?.route, params?.query),
            queryFn: () => queryFn(params)
        }) as UseQueryResult<z.infer<ResponseSchema>['response']>
}
