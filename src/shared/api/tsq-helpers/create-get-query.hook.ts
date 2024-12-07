import { QueryKey, useQuery, UseQueryResult } from '@tanstack/react-query'
import { z } from 'zod'

import { createUrl, handleRequestError } from '../helpers'
import { CreateGetQueryHookArgs } from '../interfaces'
import { instance } from '../axios'

type QueryParams<R, Q> = {
    query?: Q
    route?: R
}

/**
 * Creates a custom hook for performing GET requests with react-query and Zod validation.
 * This hook handles data fetching, caching, validation and error handling in a type-safe way.
 *
 * @template ResponseSchema - Zod schema type for validating API response
 * @template RequestQuerySchema - Zod schema type for validating query parameters
 * @template RouteParamsSchema - Zod schema type for validating route parameters
 * @template ErrorHandler - Type for custom error handler function
 *
 * @param options - Configuration options for creating the query hook
 * @param options.endpoint - API endpoint URL with optional route params (e.g. '/api/users/:id')
 * @param options.responseSchema - Zod schema for validating API response data
 * @param options.requestQuerySchema - Optional Zod schema for validating query parameters
 * @param options.routeParamsSchema - Optional Zod schema for validating route parameters
 * @param options.rQueryParams - React Query options (staleTime, refetchInterval etc.)
 * @param options.queryParams - Optional default query parameters to include in every request
 * @param options.routeParams - Optional default route parameters to include in every request
 * @param options.errorHandler - Optional custom error handler function
 * @param options.getQueryKey - Function to generate unique React Query cache key
 *
 * @returns A custom React hook that returns UseQueryResult with proper typing
 *
 * @example
 * ```typescript
 * // Define the query hook
 * const useGetUsers = createGetQueryHook({
 *   endpoint: '/api/users',
 *   responseSchema: z.object({
 *     response: z.array(z.object({
 *       id: z.string(),
 *       name: z.string()
 *     }))
 *   }),
 *   requestQuerySchema: z.object({
 *     page: z.number(),
 *     limit: z.number()
 *   }),
 *   rQueryParams: {
 *     staleTime: 5000,
 *     refetchInterval: 10000
 *   },
 *   getQueryKey: (params) => ['users', params]
 * });
 *
 * // Use the hook in a component
 * function UsersList() {
 *   const { data, isLoading, error } = useGetUsers({
 *     query: { page: 1, limit: 10 }
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
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
    errorHandler,
    getQueryKey
}: CreateGetQueryHookArgs<ResponseSchema, RequestQuerySchema, RouteParamsSchema> & {
    getQueryKey: (
        params: QueryParams<z.infer<RouteParamsSchema>, z.infer<RequestQuerySchema>>
    ) => QueryKey
}) {
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
        rQueryParams?: Partial<typeof rQueryParams>
    }) =>
        useQuery({
            ...rQueryParams,
            ...params?.rQueryParams,
            queryKey: getQueryKey({
                route: params?.route,
                query: params?.query
            }),
            queryFn: () => queryFn(params)
        }) as UseQueryResult<z.infer<ResponseSchema>['response']>
}
