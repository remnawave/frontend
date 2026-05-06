import { QueryKey, useQuery, UseQueryResult } from '@tanstack/react-query'
import { z } from 'zod'

import { createUrl, handleRequestError } from '../helpers'
import { CreateBodyQueryHookArgs } from '../interfaces'
import { instance } from '../axios'

type QueryParams<R, Q, B> = {
    body?: B
    query?: Q
    route?: R
}

/**
 * Creates a custom hook for performing requests that carry a body
 * (e.g. a POST endpoint that semantically performs a read) using
 * react-query and Zod validation. The body and query are part of the
 * `queryKey`, so changes to either trigger a refetch automatically — no
 * `useEffect` plumbing on the consumer side.
 *
 * Use `createGetQueryHook` for plain GET requests and `createMutationHook`
 * for mutating endpoints; use this helper only when an idempotent read
 * needs a body (typically because filters don't fit in a query string).
 */
export function createBodyQueryHook<
    ResponseSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    RouteParamsSchema extends z.ZodType,
    BodySchema extends z.ZodType
>({
    endpoint,
    requestMethod,
    responseSchema,
    requestQuerySchema,
    queryParams,
    routeParams,
    bodySchema,
    rQueryParams,
    errorHandler,
    getQueryKey
}: CreateBodyQueryHookArgs<ResponseSchema, RequestQuerySchema, RouteParamsSchema, BodySchema> & {
    getQueryKey: (
        params: QueryParams<
            z.infer<RouteParamsSchema>,
            z.infer<RequestQuerySchema>,
            z.infer<BodySchema>
        >
    ) => QueryKey
}) {
    const queryFn = async (params?: {
        body?: z.infer<BodySchema>
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
    }) => {
        const validatedQuery = requestQuerySchema?.parse({ ...queryParams, ...params?.query })

        const url = createUrl(endpoint, validatedQuery, params?.route ?? routeParams)

        const data = bodySchema ? bodySchema.parse(params?.body) : params?.body

        return instance
            .request<z.infer<ResponseSchema>>({
                method: requestMethod,
                url,
                data
            })
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
        body?: z.infer<BodySchema>
        query?: z.infer<RequestQuerySchema>
        route?: z.infer<RouteParamsSchema>
        rQueryParams?: Partial<typeof rQueryParams>
    }) =>
        useQuery({
            ...rQueryParams,
            ...params?.rQueryParams,
            queryKey: getQueryKey({
                route: params?.route,
                query: params?.query,
                body: params?.body
            }),
            queryFn: () => queryFn(params)
        }) as UseQueryResult<z.infer<ResponseSchema>['response']>
}
